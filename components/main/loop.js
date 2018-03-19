'use strict';

const http = require('http');
const https = require('https');
const ee = require('events');
const pipeEvents = require('pipe-event');
const ArchiveParser = require('./archive-parser');
const cache = require('./loopcache.json');
const Throttle = require("./throttle.js");

// utils 

const genReqErrorMsg = code => {
    switch(code) {
        case "ENOTFOUND":
        return "Unable to connect to Tumblr, possible internet connection issue";

        default:
        return code;
    }
};

const genRespErrorMsg = code => {
    switch(code) {
        case 429:
        return "Tumblr's request rate limit triggered";

        case 404:
        return 'Potential invalid Blog Name';

        case 301:
        return 'Blog redirects out of Tumblr, cannot scrape';

        default:
        return `${code} ${http.STATUS_CODES[c]}`;
    }

}

// loop

class RequestLoop extends ee {
  constructor() {
    super();

    const self = this;

    var protocol = http;
    var ishttps = false;
    var page = '';

    var throttling = true;

    const agentOptions = {
        keepAlive: true,
        maxSockets: 1,
        maxFreeSockets: 0
    };

    const options = {
        host: '',
        path: '',
        agent: new protocol.Agent(agentOptions),
        timeout: 9000,
        headers: {
            'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                'Chrome/56.0.2924.87 Safari/537.36'
        }
    };

    const switchProtocol = () => {
        if (ishttps) 
            protocol = (ishttps = false, http);
        else 
            protocol = (ishttps = true, https);

        options.agent.destroy();
        options.agent = new protocol.Agent(agentOptions);
    }

    

    const parser = new ArchiveParser()
    .on('page', page => { 
        options.path = page['path']; 
    })
    .on('post', post => {
        post.ishttps = ishttps;
        self.emit('post', post);
    });

    pipeEvents(['page', 'date'], parser, self);

    var req = null; 
    var running = false;
    var redir = false;

    const newRequest = () => {

        let onError = (err) => {
            if (!running) return;
            running = false;
            req.once("abort", () => {
    
                if (err.code === "ECONNRESET") 
                    return;  /* See: https://github.com/nodejs/node/issues/12047 */
                let eErr = new Error();
                eErr.message = genReqErrorMsg(err.code);
                eErr.path = options.path || cache['path'];
                eErr.host = options.host;
                self.emit("error", eErr);

            });
            req.abort();
        }

        let onResponse = () => {
            cache["path"] = options.path;
            options.path = ""; // blank path
        }

        let onTimeout = () => {
            if (!running) return;
            running = false;
            req.once("abort", () => self.emit("timeout"));
            req.abort();
        } 

        return protocol.get(options, callback)
        .on('error', onError)
        .on('response', onResponse)
        .setTimeout(7000, onTimeout);
    }

    const callback = (res) => {
      
        res.setEncoding();

        if (res.statusCode !== 200) {
            switch(res.statusCode) {
                case 302:
                case 303:
                case 307:
                    if (redir) { /* end with redirect error */
                        if (!running) return;
                        running = false;

                        req.once('abort', () => {
                            let err = Error();
                            err.message = "redirect error";
                            err.host = options.host;
                            err.path = options.path;
                            err.rescode = res.statusCode;
                            self.emit('error', err);
                        });

                        req.abort();
                        
                    } else {
                        /* switch protocol and try again */
                        redir = true;
                        switchProtocol();
                        self.continue();
                    }
                    break;

                default:
                    if (!running) return;
                    running = false;

                    req.once('abort', () => {
                        const msg = genRespErrorMsg(res.statusCode);
                        let err = new Error();
                        err.message = msg;
                        err.host = options.host;
                        err.path = options.path || cache['path'];
                        err.code = res.statusCode;
                        self.emit('error', err);
                    });
                    req.abort();
                    
            }
            return;
        }

        if (redir) 
            redir = false;

        res.on('data', chunk => parser.write(chunk));

        res.on('end', () => {
            if (running && '' === options.path){ /* no next page found, loop end */
                parser.end();
                self.emit('end');
            }
            else if (running) {
                if (throttling) {
                    let to = Throttle.getMSTimeout();
                    if (to < 100) 
                        req = newRequest();
                    else 
                        setTimeout(() => req = newRequest(), to);
                }
                else 
                    req = newRequest();
            }
        });
    }

    /* public funcs */

    this.go = function(types, blogname, path='/archive'){
        Throttle.reset();
        cache.types = types;
        parser.setMediaTypes(types);
      
        cache.blogname = blogname;
        options.host = `${blogname}.tumblr.com`;
      
        cache.path = path;
        options.path = path;
        
        running = true;
        req = newRequest();
    }

    this.stop = function(){
        if (running){
            running = false;
            req.once('abort', () => self.emit('stopped'));
            req.abort();
        } else 
            self.emit("stopped");
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

    this.toggleThrottle = function() {
        throttling = !throttling;
    }

    this.getThrottle = () => throttling;

  }
}

module.exports = RequestLoop;