const Parser = require('./parser');
const { EventEmitter } = require('events');
const config = require('../../config');
const tumblrTypes = require('../tumblrTypes');
const stateUtils = require('./stateUtils');
const log = require('electron-log');
const { 
    makeError, 
    shallowMerge,
    code2Message,
    httpStatus2Message
} = require('./utils');
/**
 * Create and observe loops that traverse through a Tumblr blog's archive,
 * identifying user uploaded posts. Emits the following events.
 * 
 * @event Loop#post - Fired when a user uploaded post is found. Handlers 
 * are invoked with request information helpful for accessing the page, 
 * and the post type. Besides the type there exists no relevant 
 * information about the content of the post.
 * @event Loop#date - Provides periodical updates about the depth of 
 * the loop. Fired before every subsequent archive request. 
 * @event Loop#end - Fired once the loop finds no further archive content. 
 * @event Loop#error - Fired when the loop encounters a fatal error. Error 
 * contains information regarding the last succesfully resolved request. 
 */
class Loop extends EventEmitter {
    constructor() {
        super();

        let parser;
        let currentRequest;
        let state = stateUtils.reset({});

        const agentOptions = {
            keepAlive: true
        };

        let requestOptions = {
            host: '',
            path: '',
            timeout: config.loopTimeoutMs,
            agent: new (stateUtils.getProtocol(state)).Agent(agentOptions),
            headers: {
                'user-agent': config.agents.desktop
            }
        };

        const lastKnownPath = () => 
            requestOptions.path || stateUtils.getLastSuccessfulPath(state);

        const canContinue = () => !!requestOptions.path;

        const errorStoppage = (error) => 
            () => {
                state = stateUtils.stopRunning(state);
                this.emit('error', error);
            };

        const callback = (res) => {
            res.setEncoding();
            if (res.statusCode !== 200) {
                if (/^30(?:2|3|7)$/i.test(res.statusCode + '')) {
                    if (!stateUtils.isUnstableProtocol(state)) { 
                        /* some tumblr blogs require https */
                        state = stateUtils.swapProtocol(state);
                        requestOptions.agent.destroy();
                        requestOptions.agent = 
                            new (stateUtils.getProtocol(state)).Agent(agentOptions);

                        currentRequest = createNewRequest();
                    }
                    else if (stateUtils.isRunning(state)) {
                        const error = makeError(
                            httpStatus2Message(res.statusCode),
                            lastKnownPath(),
                            requestOptions.host
                        );

                        currentRequest.abort();
                        currentRequest.once('abort', errorStoppage(error));
                    }
                }

                return;
            }

            if (stateUtils.isUnstableProtocol(state)) 
                state = stateUtils.safeProtocolState(state);

            res.on('data', chunk => {
                parser.write(chunk);
            });

            res.on('end', () => {
                if (stateUtils.isRunning(state)) {
                    if (canContinue()) {
                        currentRequest = createNewRequest();
                        return;
                    }

                    parser.end();
                    this.emit('end');
                } 
            });
        }
        /**
         * Creates a new request to based on the current info request options.
         */
        const createNewRequest = () => 
            stateUtils.getProtocol(state).get(requestOptions, callback)
                .on('error', (error) => {
                    if (stateUtils.isRunning(state)) {
                        if (error.code === 'ECONNRESET') 
                            /* thrown on abort */
                            return;

                        const err = makeError(
                            code2Message(error.code),
                            requestOptions.host,
                            lastKnownPath(),
                            error.code
                        ); 

                        currentRequest.abort();
                        currentRequest.once('abort', errorStoppage(err));
                    }
                })
                .on('response', () => {
                    /* on response, blank out options path */ 
                    state = stateUtils.setLastSuccessfulPath(state, requestOptions.path);
                    requestOptions.path = '';
                })
                .setTimeout(config.loopTimeoutMs, () => {
                    if (stateUtils.isRunning(state)) {
                        const error = makeError(
                            'request timeout',
                            requestOptions.host,
                            lastKnownPath()
                        );
                        currentRequest.once('abort', errorStoppage(error));
                        currentRequest.abort();
                    }
                });

        /**
         * Kickoff traversing through a Tumblr blog's archive. 
         * 
         * @param {String[]} types - the type of posts which are of interest, valid values:
         * photo, video, quote, text, chat, note (asks), audio.
         * @param {String} blog - name of the blog to traverse.
         * @param {Function} callback - invoked once loop succesfully begins
         * to facilitate begining at a point in the middle of an archive. 
         */
        this.go = (types, blog, callback) => {
            const kickoff = () => {
                requestOptions = shallowMerge(requestOptions, {
                    host: `${blog}.tumblr.com`,
                    path: '/archive'
                });

                parser = new Parser(types.map(t => tumblrTypes[t]), blog)
                    .on('page', page => {  
                        requestOptions.path = page.path;
                    })
                    .on('date', date => {
                        this.emit('date', date);
                    })
                    .on('post', post => {
                        this.emit('post', shallowMerge(post, {
                            isHttps: stateUtils.isHttps(state)
                        }));
                    });
                
                state = stateUtils.startRunning(stateUtils.reset(state), blog);
                currentRequest = createNewRequest();
                callback();
            }

            if (stateUtils.isRunning(state)) {
                currentRequest.abort();
                currentRequest.once('abort', kickoff);
                return;
            }

            process.nextTick(kickoff);
        };
        /**
         * Pause a currently executing loop. 
         * 
         * @param {Function} callback - invoked once the request loop is aborted.
         */
        this.pause = (callback) => {
            if (stateUtils.isRunning(state)) {
                currentRequest.once('abort', () => {
                    state = stateUtils.stopRunning(state);
                    callback();
                });
                currentRequest.abort();
                return;
            }
            
            log.warn('attempted to pause already paused loop');
            process.nextTick(callback);
        };
        /**
         * Resume execution of a paused loop. 
         */
        this.resume = (callback) => {
            if (stateUtils.isRunning(state)) {
                log.warn('Attempted to continue an already running loop.');
                return;
            }

            const path = lastKnownPath();
            const blog = stateUtils.getBlog(state);
                
            if (blog && path) {
                state = stateUtils.startRunning(state, blog);
                currentRequest = createNewRequest();
                process.nextTick(callback, true);
                return;
            }
            
            process.nextTick(callback, false);
        };
    }
}

module.exports = Loop;