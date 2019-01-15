const express = require('express');
const assert = require('assert');
const socketio = require('socket.io');
const Loop = require('./lib/loop');
const getPostData = require('./lib/post');
const log = require('electron-log');
const { removeMORE, pipeEmit } = require('./utils');

let port;

try {
    port = getPort();
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

function getPort() {
    const p = process.env.PORT >>> 0;
    assert(p >= 0x400 && p <= 0xFFFF, 'invalid port value');
    return p;
}