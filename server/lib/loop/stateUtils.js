const http = require('http');
const https = require('https');
const { shallowMerge } = require('./utils');

const isRunning = state => 
    state.running;

const isUnstableProtocol = state => 
    state.inProtoSwapState;

const isHttps = state => 
    state.protocol === https;

const getLastSuccessfulPath = state => 
    state.lastSuccessfulPath;

const getProtocol = state => 
    state.protocol;

const getBlog = state => 
    state.blog;

const startRunning = (state, blog) => 
    shallowMerge(state, { running: true, blog });

const stopRunning = state => 
    shallowMerge(state, { running: false });

const swapProtocol = state => 
    shallowMerge(state, { 
        protocol: state.protocol === http ? https : http,
        inProtoSwapState: true
    });

const safeProtocolState = state => 
    shallowMerge(state, {
        inProtoSwapState: false
    });
    
const setLastSuccessfulPath = (state, path) => 
    shallowMerge(state, {
        lastSuccessfulPath: path
    });

const reset = state => 
    shallowMerge(state, {
        running: false,
        protocol: http,
        lastSuccessfulPath: '',
        blog: '',
        inProtoSwapState: false
    });

module.exports = {
    isRunning,
    isUnstableProtocol,
    isHttps,
    getLastSuccessfulPath,
    getProtocol,
    getBlog,
    startRunning,
    stopRunning,
    swapProtocol,
    safeProtocolState,
    setLastSuccessfulPath,
    reset
}