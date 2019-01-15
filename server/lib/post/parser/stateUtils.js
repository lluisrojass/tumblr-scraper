const { shallowMerge } = require('../../utils');

const isPostFound = state => 
    state.postFound;

const isPostIdentified = state => 
    state.postIdentified;

const isVideoFound = state => 
    state.videoFound;

const setPostFound = state => 
    shallowMerge(state, { postFound: true });

const setVideoFound = state => 
    shallowMerge(state, { videoFound: true });

const postIdentified = state =>
    shallowMerge(state, { 
        postIdentified: true
    });

const postUnidentified = state => 
    shallowMerge(state, { 
        postIdentified: false
    });

const reset = (state) => shallowMerge(state, {
    postFound: false,
    postIdentified: false,
    videoFound: false
});

module.exports = {
    isPostFound,
    isPostIdentified,
    isVideoFound,
    setPostFound,
    setVideoFound,
    postIdentified,
    postUnidentified,
    reset
};