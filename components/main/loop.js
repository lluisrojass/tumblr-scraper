'use strict';
const http = require('http');
const https = require('https');
const ee = require('events');
const pipeEvents = require('pipe-event');
const {ArchiveParser} = require('./parsers');
const cache = require('./loopcache.json');

/*
 > Code for the requests loop traversing a blogs archive.
                          +--------+
                          | Events |
                          +--------+
error: Loop terminating error encountered.
       arg is dict with props msg (error message), hostname, path.
timeout: current request has timed out. Loop terminated.
stopped: Loop successfully stopped by user call to :func: stop.
end: Loop has finished parsing a blogs archive.
 > Piped events from parser.
page: Loop has encountered the path for the subsequent request.
      arg is dict with prop page containing the path.
post: Loop encountered a user uploaded post.
      arg is dict with props hostname, pathname, ptype (post type), ishttps.
*/
module.exports = class RequestLoop extends ee {
  constructor() {
    super();
    const self = this;
    var protocol = http;
    var ishttps = false;
    var page = '';
    const agentOptions = {
      keepAlive:true,
      maxSockets:1,
      maxFreeSockets:0
    };
    const options = {
      host:'',
      path:'',
      agent: new protocol.Agent(agentOptions),
      timeout:9000,
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) ' +
                     'AppleWebKit/537.36 (KHTML, like Gecko) '+
                     'Chrome/56.0.2924.87 Safari/537.36'
      }
    };
    const switchProtocol = function(){
      protocol = (() => {
        if (ishttps){
          ishttps = false;
          return http;
        } else {
          ishttps = true;
          return https;
        }
      })();
      options.agent.destroy();
      options.agent = new protocol.Agent(agentOptions);
    }
    const parser = new ArchiveParser().on('page', page => options.path = page['path'])
                                      .on('post', post => {
                                        post.ishttps = ishttps;
                                        self.emit('post', post);
                                      });
    pipeEvents(['page', 'date'], parser, self);
    var req = null; /* current request */
    var running = false;
    var redir = false;
    const newRequest = function(){
      //console.log('new request! - '+options.host+options.path);
      return protocol.get(options, callback)
        .on('error', (e) => {
          if (running){
            running = false;
            req.once('abort',() => {
              if (e.code === 'ECONNRESET') return; /* See: https://github.com/nodejs/node/issues/12047 */
              const msg = ((c) => {
                switch(c){
                  case 'ENOTFOUND':
                    return 'Not able to connect to Tumblr. Check internet connection';
                  default:
                    return c;
                }
              })(e.code);
              self.emit('error', {
                'host': options.host,
                'path': options.path,
                'msg': msg
              });
            });
            req.abort();
          }
        })
        .on('response', () => {
          cache['path'] = options.path;
          options.path = '';
        })
        .setTimeout(7000, () => {
          if (running){
            running = false;
            req.once('abort', () => self.emit('timeout'));
            req.abort();
          }
        });
    }

    const callback = function(res){
      res.setEncoding();
      if (res.statusCode !== 200) {
        switch(res.statusCode){
          case 302:
          case 303:
          case 307:
            if (redir){ /* end with redirect error */
              redir = false;
              if (running){
                running = false;
                req.once('abort',() => {
                  self.emit('error', {
                    host:options.host,
                    path:options.path,
                    msg:'Redirect error'
                  });
                });
                req.abort();

              }
            } else {
              redir = true;
              switchProtocol();
              self.continue();
            }
            break;
          default:
            if (running){
              running = false;
              req.once('abort', () => {
                const msg = ((c) => {
                  switch(c) {
                    case 429:
                      return 'Tumblr\'s request rate limit triggered';
                    case 404:
                      return '404, Possible invalid Blog Name';
                    case 301:
                      return 'Blog redirects out of Tumblr, cannot scrape';
                    default:
                      return `${c} ${http.STATUS_CODES[c]}`;
                  }
                })(res.statusCode);
                //console.log('Error:(loop) '+options.host+options.path+' recieved msg '+res.statusCode);
                self.emit('error', {
                  'host': options.host,
                  'path': options.path,
                  'msg': msg
                });
              });
              req.abort();
            }
        }
        return;
      } else if (redir) redir = false;

      res.on('data', chunk => {
        parser.write(chunk);
        //page += chunk;
      });

      res.on('end', () => {
        //parser.write(page);
        //page = '';
        if (running && '' === options.path){ /* no next page found, loop end */
          parser.end();
          self.emit('end');
        }
        else if (running)
          req = newRequest();
      });
    }

    //-- -- -- -- --//
    /* public funcs */
    //-- -- -- -- --//

    this.go = function(types, blogname, path='/archive'){
      running = true;
      if (cache['types'] !== types){
        cache.types = types;
        parser.setMediaTypes(types);
      }
      if (cache['blogname'] !== blogname){
        cache.blogname = blogname;
        options.host = `${blogname}.tumblr.com`;
      }
      if (cache['path'] !== path){
        cache.path = path;
        options.path = path;
      }
      req = newRequest();
    }

    this.stop = function(){
      if (running){
        running = false;
        req.once('abort', () => self.emit('stopped'));
        req.abort();
      }
    }

    this.continue = function(){
      if (cache['blogname'] && cache['path'] && cache['types']) {
        options.path = options.path || cache['path'];
        running = true;
        req = newRequest();
        return true;
      }
      return false;
    }
  }
}
