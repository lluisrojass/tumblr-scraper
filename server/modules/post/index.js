const http = require('http');
const https = require('https');
const Parser = require('./parser');
const config = require('../../config');
/**
 * Function which retrieves a specific post's
 * information.
 * 
 * @param {Object} post - contains request info
 * about the post
 * @param {Function} callback - signature (error, post)
 */
module.exports = function(post, callback) {
  const {
    type,
    blog,
    path,
    isHttps
  } = post;

  const protocol = isHttps ? https : http;
  const options = {
    host: `${blog}.tumblr.com`,
    /* tumblr supports /mobile */
    /* endpoint to request a */
    /* minimal page */
    path: config.optimizePostRequest && type !== 'is_video' ? 
      encodeURI(path) + '/mobile'
      :
      encodeURI(path),
    timeout: config.postTimeoutMs,
    headers: {
      'user-agent': config.agents.mobile
    }
  };

  const parser = new Parser(type)
    .on('post', (data) => {
      request.abort();
      callback(null, data);
    });

  let request;

  function resCallback(res) {
    res.setEncoding();
    if (res.statusCode !== 200) {
      /* TODO: handle redirects here ? */
      if (!request.aborted){
        request.abort();
        callback(new Error(`invalid response`+
        `, recieved ${res.statusCode}`));
      }
    }

    res.on('data', chunk => {
      if (!request.aborted) {
        parser.write(chunk);
      }
    });
  }

  request = protocol.get(options, resCallback)
    .on('error', error => {
      if (!request.aborted){
        request.abort();
        callback(new Error(`request error, ${error.message}`));
      }
    });
};