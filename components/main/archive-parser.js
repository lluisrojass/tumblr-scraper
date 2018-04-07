"use strict";

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const url = require('url');

class ArchiveParser extends ee {
    
    constructor() {
        super();

        var self = this;
        /* last encountered date string */
        var date = '';
        /* boolean denoting if a post has been found */
        var pfound = false; 
        /* boolean denoting if date has been found */
        var dfound = false;
        /* index for current post type in types array */
        var currTypeIndex = -1; 
        /* 'is_photo' 'is_video' 'is_quote' 'is_regular' (text) 'is_chat' 'is_note' (ask) 'is_audio' */
        var types = []; 
        /* blog name cache */
        var blogName = "";

        /* utility to validate a class string, also to cache type index, if one found */
        const validClassAndSaveIndex = (classStr) => {
            if (classStr.includes('is_original')) {
                for (let i = 0 ; i < types.length ; ++i) {
                    if (classStr.includes(types[i])) {
                        currTypeIndex = i; // identify post type
                        return true;
                    }
                }
            }
            return false;
        }

        const onOpenTag = (name, attribs) => {

            if (name === 'div' && attribs.class && validClassAndSaveIndex(attribs.class))
                pfound = true;
            
            else if (attribs.id && attribs.id === 'next_page_link')
                self.emit('page', { path: attribs.href });
  
            else if (name === 'h2' && attribs.class && attribs.class === 'date')
                dfound = true;

            else if (pfound && attribs['data-peepr'] && name === 'a' && attribs.href) {
                try { 
                    var {hostname, path=""} = url.parse(attribs.href); 
                } 
                catch (err) {/* incorrect attribs.href error */}

                if (hostname.indexOf(blogName) != -1) {
                
                    (
                        self.emit("post", {
                            "host": hostname,
                            path,
                            "type": types[currTypeIndex]
                        }),
                        pfound = false,
                        currTypeIndex = -1
                    );
                }
                
            }
        }

        const onText = (text) => {
            if (dfound) {
                if (text !== date) 
                    (date = text, self.emit('date', { date }))
                
                dfound = false;
            }
        }

        var parser = new htmlparser2.Parser({ onopentag: onOpenTag, ontext: onText }, { decodeEntities: true });
  
        self.configure = (mtypes, currBlogName) => (types = mtypes, blogName = currBlogName, true);
        self.write = chunk => (parser.write(chunk), true);
        self.end = () => (parser.parseComplete(), true);
    }
}

module.exports = ArchiveParser;