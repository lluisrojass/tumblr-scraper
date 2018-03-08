'use strict';

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const videoSites = require('./videoSites.json')['sites'];

class PostParser extends ee {
    constructor(type){
        super();

        const self = this;
        var jsonFound = false;
        var isVideo = type === 'is_video' ? true : false;
        var emitted = false;
        var pseg = '';
        var post = null;

        const onOpenTag = (name, attribs) => {
            if (name === 'script' && attribs.type && attribs.type === 'application/ld+json')
                jsonFound = true;
            else if (isVideo && name === 'section' && attribs['class'] && attribs['class'].includes('related-posts-wrapper')){
                /* done with post info, no valid video link found */
                post.isVideo = true;
                post.videoURL = '';
                self.emit('post', post);
                emitted = true;
            }
            else if (isVideo && (name === 'iframe' || name === 'video') && attribs['src']) {
                var {src} = attribs;
                var i = 0;
                do {
                    if (src.indexOf(videoSites[i++]) !== -1){
                        post.isVideo = true;
                        post.videoURL = (src.substring(0,4) === 'http' ? src : 'http:'+src);
                        self.emit('post', post);
                        emitted = true;
                        break;
                    }
                } while (videoSites[i]);
            }
        } 

        const onText = (text) => {
            if (jsonFound) {
                try {
                    pseg += text;
                    post = JSON.parse(pseg); // throws parse exception if response segmented
                    jsonFound = false;
                    if (!isVideo) { /* videos are not emitted via json text */
                        post.isVideo = false;
                        self.emit('post', post);
                        emitted = true;
                    }
                }
                catch (err) {/* segmented response */}
            }
        }

        const parser = new htmlparser2.Parser({
            onopentag:onOpenTag,
            ontext:onText,
        }, {decodeEntities: true});

        /* public funcs */
    
        this.write = function(chunk){
            if (!emitted) 
                parser.write(chunk);
        }

        this.end = function(){
            parser.parseComplete();
        }  
    }
}

module.exports = PostParser;
