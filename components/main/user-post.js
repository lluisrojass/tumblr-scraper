"use strict";

const http = require("http");
const https = require("https");
const PostParser = require("./post-parser");
const url = require("url");
/**
 * fetches all relevent post information 
 * 
 * @param {Object} postData - object containing information regarding an encounterd post
 * @param {Function} callback - error first format, calls with post info object
 */
module.exports = function(postData, callback) {

    const {type, host, path, ishttps=false} = postData;
    const protocol = ishttps ? https : http;
    const parser = new PostParser(postData.type);
    var request; 
    
    var haltParse = false;
    var redir = false;

    const options = {
        host: host,
        path: type === 'is_video' ? path : path + "/mobile", // request simple page when 
        timeout: 8000,
        headers: {
        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) ' +
            'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 ' +
            'Safari/601.1'
        }
    };

    const pData = {
        href: host + path,
        type: type.tumblrTypeTranslate(),
        post: null
    };

    /* on parser found event */
    parser.on("post", (data) => {
        haltParse = true;
        pData.post = data;
        request.abort();
        callback(null, pData); // data found
    });

    const onReqError = e => {
        haltParse = true;
        request.abort();

        let err = new Error();
        err.code = "ER_BAD_REQ";
        err.path = options.path;
        err.message = e.message;
        callback(err, null);
    }

    const resCallback = res => {

        if (res.statusCode !== 200) {
            
            if (!redir && res.statusCode == 301) {
                (redir = true, request.abort(), parser.end());
                // re-request with new path
                let { path=options.path } = url.parse(res.headers["location"]);
                options.path = path;
                request = protocol.get(options, resCallback).on("error", onReqError);
            }
            else {
                haltParse = true;
                request.abort();

                let err = new Error();
                err.code = "ER_BAD_RESP";
                err.path = options.path;
                err.message = `${res.statusCode} received`;

                callback(err, null); 
            }
        }

        res.on("data",(chunk) => {
            if (!haltParse)
                parser.write(chunk);
        });

    }

    request = protocol.get(options, resCallback).on("error", onReqError);
}
