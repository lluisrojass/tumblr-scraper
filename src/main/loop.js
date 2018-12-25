'use strict';

const http = require('http');
const https = require('https');
const ee = require('events');
const pipeEvents = require('pipe-event');
const ArchiveParser = require('./archive-parser');
const Throttle = require('./throttle.js');
const config = require('./config');
/**
 * @param {String} code - error code (usually from error.code)
 * @api private
 */
const genReqErrorMsg = code => {
    switch(code) {
        case 'ENOTFOUND':
            return 'Unable to connect to Tumblr, possible internet connection issue';

        default:
            return code;
    }
};
/**
 * @desc gen readable error message from response error code
 * @param {Number} code 
 */
const genRespErrorMsg = code => {
    switch(code) {
        case 429:
            return 'request rate limit hit';

        case 404:
            return 'blog not found';

        case 301:
            return 'blog redirects out of tumblr';

        case 302:
        case 303:
        case 307:
            return 'redirect error';

        default:
            return `${code} ${http.STATUS_CODES[c]}`;
    }

};
/**
 * 
 * @param {Object} self 
 * @param {String} host 
 * @param {String} path 
 * @param {String} message 
 * @api private
 */
function emitStandardError(self, host, path, message) {
    return () => {
        let err = Error();
        err.message = message;
        err.host = host;
        err.path = path;
        self.emit('error', err);
    };
}

class RequestLoop extends ee {
    constructor() {
        super();

        const self = this;

        const state = {
            running: false, 
            wasRedirected: false,
            isHttps: false,
            throttling: config['beginWithThrottle'],
            prevPath: '',
            blogName: ''
        };
    
        var blogname = '';
        var protocol = http;
        /* current request */
        var req = null; 
        /* request agent config */
        const agentOptions = {
            keepAlive: true,
            maxSockets: 1,
            maxFreeSockets: 0
        };

        const requestOptions = {
            host: '',
            path: '',
            agent: new protocol.Agent(agentOptions),
            timeout: config['responseTimeoutMS'],
            headers: { 'user-agent': config['userAgent'] }
        };

        const parser = new ArchiveParser()
            .on('page', page => requestOptions.path = page['path'])
            .on('post', post => (post.isHttps = state.isHttps, self.emit('post', post)));

        pipeEvents(['page', 'date'], parser, self);

        const newRequest = () => (
            protocol.get(requestOptions, callback)
                .on('error', (err) => {

                    if (!state['running']) return;
                    state['running'] = false;

                    if (err.code === 'ECONNRESET') return;  /* See: https://github.com/nodejs/node/issues/12047 */

                    req.once(
                        'abort', 
                        emitStandardError(
                            self,
                            requestOptions.host,
                            requestOptions.path || state['prevPath'],
                            genReqErrorMsg(err.code)
                        )
                    );
                
                    req.abort();
                })
                .on('response', () => {
                    state['prevPath'] = requestOptions.path;
                    requestOptions.path = ''; // blank path
                })
                .setTimeout(config['responseTimeoutMS'] || 7000, () => {
                    if (!state['running']) return;
                    state['running'] = false;
                    req.once('abort', () => self.emit('timeout'));
                    req.abort();
                })
        );

        const callback = (res) => {
            res.setEncoding();

            if (res.statusCode !== 200) {

                switch(res.statusCode) {
                    case 302:
                    case 303:
                    case 307:
                        if (state['wasRedirected']) { 
                            if (!state['running']) return;
                            state['running'] = false;

                            req.once(
                                'abort', 
                                emitStandardError(
                                    self, 
                                    requestOptions.host, 
                                    requestOptions.path, 
                                    genRespErrorMsg(res.statusCode)
                                )
                            );
                
                            req.abort();
                    
                        } else {
                            /* switch protocol and try again */
                            state['wasRedirected'] = true;
                            protocol = (state['isHttps']) ? (state['isHttps'] = false, http) : (state['isHttps'] = true, https);
                            requestOptions.agent.destroy();
                            requestOptions.agent = new protocol.Agent(agentOptions);
                            self.continue();
                        }
                        break;

                    default:
                        if (!state['running']) return;
                        state['running'] = false;
            
                        req.once(
                            'abort', 
                            emitStandardError(
                                self, 
                                requestOptions.host, 
                                requestOptions.path || state['prevPath'], 
                                genRespErrorMsg(res.statusCode)
                            )
                        );

                        req.abort();
                        break;
                    
                }
                return;
            }
            /* clear redirect */
            if (state['wasRedirected']) state['wasRedirected'] = false;

            res.on('data', chunk => parser.write(chunk));

            res.on('end', () => {
                if (state['running']) {
                /* no next page found, loop end */
                    if ('' === requestOptions.path) {
                        parser.end();
                        self.emit('end');
                    }

                    else if (state['throttling']) {
                        let timeout = Throttle.getMSTimeout();
                        if (timeout < 100) req = newRequest();
                        else setTimeout(() => req = newRequest(), timeout);
                    }
                
                    else 
                        req = newRequest();

                }
            });
        };

        self.go = (types, blogName, path='/archive') => {
            Throttle.reset();
            parser.configure(types, blogName);
            requestOptions.host = `${blogName}.tumblr.com`;
            requestOptions.path = path;
            state['running'] = true;
            state['blogName'] = blogName;
            state['types'] = types;
            state['wasRedirected'] = false;
            state['prevPath'] = path;
            req = newRequest();
        };

        self.stop = () => {
            if (state['running']) {
                state['running'] = false;
                req.once('abort', () => self.emit('stopped'));
                req.abort();
            } 
            else self.emit('stopped');
        };

        self.continue = () => {
            if (state['blogName'] && state['prevPath'] && state['types']) {
            /* regen path */
                requestOptions.path = requestOptions.path || state['prevPath'];
                state['running'] = true;
                req = newRequest();
                return true;
            }
            return false;
        };

        self.toggleThrottle = () => (state['throttling'] = !state['throttling'], true);
        self.getThrottle = () => state['throttling'];

    }


}

module.exports = RequestLoop;