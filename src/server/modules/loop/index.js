const Parser = require('./parser');
const { EventEmitter } = require('events');
const log = require('electron-log');
const config = require('../../config');
const stateUtils = require('./stateUtils');
const { 
  makeError, 
  shallowMerge,
  code2Msg,
  httpCode2Msg,
  is30x,
  gotServerError
} = require('./utils');

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
      (requestOptions.path || stateUtils.getLastSuccessfulPath(state));
    const canContinue = () => !!requestOptions.path;
    const launchRequest = () => {
      currentRequest = createNewRequest();
    };

    const stopAndEmitError = (error) => () => {
      state = stateUtils.stopRunning(state);
      this.emit('error', error);
    };

    const callback = (res) => {
      res.setEncoding();
      state = stateUtils.setLastSuccessfulPath(state, requestOptions.path);
      requestOptions.path = '';

      if (is30x(res.statusCode)) {
        const isProtoStable = !stateUtils.isUnstableProtocol(state);
        if (isProtoStable) {
          state = stateUtils.swapProtocol(state);
          const newProtocol = stateUtils.getProtocol(state);
          requestOptions.agent.destroy();
          requestOptions.agent = new (newProtocol).Agent(agentOptions);
          launchRequest();
        }
        else if (stateUtils.isRunning(state)) {
          const error = makeError(
            httpCode2Msg(res.statusCode),
            lastKnownPath(),
            requestOptions.host
          );
          currentRequest.abort();
          currentRequest.once('abort', stopAndEmitError(error));
        }
      }
      else if (gotServerError(res.statusCode)) {
        const error = makeError(
          httpCode2Msg(res.statusCode),
          lastKnownPath(),
          requestOptions.host
        );
        currentRequest.abort();
        currentRequest.once('abort', stopAndEmitError(error));
      }

      if (stateUtils.isUnstableProtocol(state)) {
        state = stateUtils.safeProtocolState(state);
      }

      res
        .on('data', chunk => { parser.write(chunk); })
        .on('end', () => {
          const isRunning = stateUtils.isRunning(state);
          if (isRunning) {
            if (canContinue()) {
              launchRequest();
            }
            else {
              parser.end();
              this.emit('end');
            }
          }
        });
    };

    const createNewRequest = () => {
      return stateUtils
        .getProtocol(state)
        .get(requestOptions, callback)
        .on('error', (error) => {
          if (stateUtils.isRunning(state)) {
            if (error.code === 'ECONNRESET') return;
            const err = makeError(
              code2Msg(error.code),
              requestOptions.host,
              lastKnownPath(),
              error.code
            ); 

            currentRequest.abort();
            currentRequest.once('abort', stopAndEmitError(err));
          }
        })
        .setTimeout(config.loopTimeoutMs, () => {
          if (stateUtils.isRunning(state)) {
            const error = makeError(
              'request timeout',
              requestOptions.host,
              lastKnownPath()
            );
            currentRequest.once('abort', stopAndEmitError(error));
            currentRequest.abort();
          }
        });
    };

    const beginLoop = (types, blog) => {
      requestOptions = shallowMerge(requestOptions, {
        host: `${blog}.tumblr.com`,
        path: '/archive'
      });

      parser = new Parser(types)
        .on('page', page => { requestOptions.path = page.path; })
        .on('date', date => { this.emit('date', date); })
        .on('post', post => { 
          this.emit('post', shallowMerge(post, {
            isHttps: stateUtils.isHttps(state)
          }));
        });
      
      state = stateUtils.startRunning(stateUtils.reset(state), blog);
      currentRequest = createNewRequest();
      this.emit('started');
    };

    this.start = (types, blog) => {
      if (stateUtils.isRunning(state)) {
        currentRequest.abort();
        currentRequest.once('abort', () => {
          beginLoop(types, blog);
        });
      }
      else {
        process.nextTick(() => {
          beginLoop(types, blog);
        });
      }
    };

    this.pause = () => {
      if (stateUtils.isRunning(state)) {
        currentRequest.abort();
        currentRequest.once('abort', () => {
          state = stateUtils.stopRunning(state);
          this.emit('paused');
        });
      }

      log.warn('attempted to pause already paused loop');
      process.nextTick(() => {
        this.emit('paused');
      });
    };

    this.resume = () => {
      if (stateUtils.isRunning(state)) {
        log.warn('Attempted to continue an already running loop.');
        return;
      }

      const path = lastKnownPath();
      const blog = stateUtils.getBlog(state);
      if (blog && path) {
        state = stateUtils.startRunning(state, blog);
        currentRequest = createNewRequest();
        process.nextTick(() => {
          this.emit('resumed', true);
        });
        return;
      }
      else {
        process.nextTick(() => {
          this.emit('resumed', false);
        });
      }
    };
  }
}

module.exports = Loop;