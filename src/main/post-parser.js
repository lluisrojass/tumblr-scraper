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
        var pseg = ''; // segment variable
        var post = null;

        const onOpenTag = (name, attribs) => {
            /* linked data (JSON-LD) found */
            if (name === 'script' && attribs.type && attribs.type === 'application/ld+json')
                jsonFound = true;
            
            /* video iframe not found */
            /* possibly not considered in videoSites.json */ 
            else if (isVideo && name === 'section' && attribs['class'] && attribs['class'].includes('related-posts-wrapper')){
                /* done with post info, no valid video link found */
                post.isVideo = true;
                post.videoURL = '';
                emitted = true;
                self.emit('post', post);
            }

            else if (isVideo && (name === 'iframe' || name === 'video') && attribs['src']) {
                let { src } = attribs;
                let i = 0;

                do {
                    if (src.indexOf(videoSites[i++]) !== -1) {
                        post.isVideo = true;
                        post.videoURL = src.substring(0, 4) === 'http' ? src : 'http:' + src;

                        emitted = true;
                        self.emit('post', post);
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
                        emitted = true;
                        self.emit('post', post);
                    }
                }
                catch (err) {/* segmented response, ignore */}
            }
        }

        const parser = new htmlparser2.Parser({ onopentag: onOpenTag, ontext: onText }, { decodeEntities: true });

        /* public functions */

        this.write = chunk => { if (!emitted) parser.write(chunk); }
        this.end = () => (parser.parseComplete(), true);
    }
}

module.exports = PostParser;
