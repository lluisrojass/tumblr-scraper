'use strict';

const http = require('http');
const https = require('https');
const PostParser = require('./post-parser');

module.exports = function(postData, callback) {
    const {type, host, path, ishttps} = postData;
    const protocol = ishttps ? https : http;
    const parser = new PostParser(postData.type);
  
    var haltParse = false;

    const options = {
        host: host,
        path: type === 'is_video' ? path : path+'/mobile',
        timeout: 5000,
        headers: {
        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) ' +
            'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 ' +
            'Safari/601.1'
        }
    };

    const pData = {
        href: host+path,
        type: type.tumblrTypeTranslate()
    };

    parser.on('post', (data) => {
        haltParse = true;
        pData.post = data;
        request.abort();
        callback(null, pData); // data found, all good to continue.
    });

    const request = protocol.get(options, (res) => {

        if (res.statusCode !== 200) {
            haltParse = true;
            request.abort();

            let err = new Error(`${res.statusCode} received`);
            err.code = "ER_BAD_RESP";
            err.path = options.path

            callback(err, null); 
        }

        res.on('data',(chunk) => {
            if (!haltParse)
                parser.write(chunk);
        });

    })
    .on('error', (e) => {
        haltParse = true;
        request.abort();

        let err = new Error(e.message);
        err.code = "ER_BAD_REQ";
        err.path = options.path;

        callback(err, null);
    });
}
