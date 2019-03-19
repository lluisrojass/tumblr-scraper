const getPostData = require('../post');
const log = require('electron-log');
const { pipeEmit, craftPost } = require('./utils');

const actionHandlers = loop => socket => {
  log.info(`socket connected with id ${socket.id}`);
  socket
    .on('start', (blog, types, ack) => {
      loop.start(blog, types);
      loop.once('started', () => ack(true));
    })
    .on('pause', ack => {
      loop.pause(ack);
      loop.once('paused', () => ack(true));
    })
    .on('resume', ack => {
      loop.resume(ack);
      loop.once('resumed', ack);
    });
};

module.exports = (server, loop) => {
  /* attach client action handlers */
  server.on('connection', actionHandlers(loop));
  /* attach server emitters */
  pipeEmit(['page', 'date', 'end', 'error'], loop, server);
  loop.on('post', postRequestData => {
    getPostData(postRequestData, (error, rawPost) => {
      if (error) {
        log.warn(error.message);
        return;
      }
      server.emit('post', craftPost(rawPost));
    });
  });
};