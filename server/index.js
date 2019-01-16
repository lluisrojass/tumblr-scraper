const express = require('express');
const assert = require('assert');
const socketio = require('socket.io');
const Loop = require('./lib/loop');
const getPostData = require('./lib/post');
const log = require('electron-log');
const { removeMORE, pipeEmit } = require('./utils');

process.on('uncaughtException', (e) => {
    log.error(e);
    process.exit(1);
});

let port;

try {
    port = extractPort();
} catch (e) {
    log.error(e.message);
    process.exit(1);
}

const loop = new Loop();
const app = express();
const expressServer = app.listen(port);
const ioServer = socketio(expressServer);

loop.on('post', postRequestData => {
    getPostData(postRequestData, (error, post) => {
        if (error) {
            log.warn(error.message);
            return;
        }

        ioServer.emit('post', {
            type: post.type,
            datePublished: post.datePublished || '',
            articleBody: !!post.articleBody ? removeMORE(post.articleBody) : '',
            headline: post.headline || '',
            images: [].concat(!post.image ? null : post.image['@list'] || post.image),
            url: post.url || '',
            isVideo: post.isVideo,
            videoURL: post.videoURL || '',
        });
    });
});

pipeEmit(['page', 'date', 'end', 'error'], loop, ioServer);

ioServer.on('connection', socket => {
    socket
        .on('start', (blog, types, ack) => {
            loop.go(blog, types, ack);
        })
        .on('pause', (ack) => {
            loop.pause(ack);
        })
        .on('resume', (ack) => {
            loop.resume(ack);
        });
});

function extractPort() {
    const possiblePortArg = process.argv[process.argv.length - 1] || "";
    let [,port] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
    assert(!!port, 'server startup error, invalid argv port argument recieved ');
    port = port >>> 0;
    assert(port >= 0x400 && port <= 0xFFFF, 'server startup error, '+
    'incorrectly formatted port argument recieved');
    return port;
}