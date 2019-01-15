const { shallowMerge } = require('../utils');
const { STATUS_CODES } = require('http');

const makeError = (message, path, host, code) => (
    shallowMerge(new Error(), {
        message: message || '',
        path: path || '',
        hostname: host || '',
        code: code || ''
    })
);

const code2Message = code => {
    switch(code) {
        case 'ENOTFOUND': {
            return 'unable to connect to Tumblr';
        }
        default: {
            return code;
        }
    }
}

const httpStatus2Message = code => {
    switch(code) {
        case 301:
        case 302:
        case 303: {
            return 'blog redirects out of Tumblr';
        }
        case 307: {
            return 'redirect error';
        }
        case 404: {
            return 'blog not found';
        }
        case 429: {
            return 'rate limit hit'; 
        }
        default: {
            return `${code} ${STATUS_CODES[code] || ""}`;
        }
    }
}

module.exports = {
    makeError,
    code2Message,
    httpStatus2Message,
    shallowMerge
};