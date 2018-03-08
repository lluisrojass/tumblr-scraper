"use strict";
const htmlparser2 = require('htmlparser2');
const ee = require('events');
const url = require('url');
const cache = require('./loopcache.json');

class ArchiveParser extends ee {
    constructor() {
        super();
        var self = this;
        var ptype = null;
        var date = '';
        var pfound = false;
        var dfound = false;
        var types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(ask) 'is_audio' */
        
        // util
        const validClass = (classStr) => {
            var valid = false;
            if (classStr.includes('is_original')) {
                types.forEach(
                    (e) => {
                        if (classStr.includes(e)){
                            valid = true;
                        ptype = e;
                    }
                });
            }
            return valid;
        }

        const onOpenTag = (name, attribs) => {
            if (name === 'div' && attribs.class && validClass(attribs.class))
                pfound = true;
  
            else if (attribs.id && attribs.id === 'next_page_link')
                self.emit('page', { path: attribs.href });
  
            else if (name === 'h2' && attribs.class && attribs.class === 'date')
                dfound = true;
  
            else if (pfound && attribs['data-peepr'] && name === 'a' && attribs.href) {
                try {
                    var {hostname, path} = url.parse(attribs.href);
                } catch (err) {/* syntax error */}
  
                if (hostname.indexOf(cache['blogname']) > -1) {  // exists
                    (self.emit('post', { 
                        'host': hostname,
                        'path': path,
                        'type': ptype 
                        }), 
                        pfound = false, 
                        ptype = null
                    );
                }
            }
        }

        const onText = (text) => {
            if (dfound) {
                if (text !== date) {
                    date = text;
                    self.emit('date', { date: date });
                }
                dfound = false;
            }
        }
  
  
        var parser = new htmlparser2.Parser({
            onopentag:onOpenTag,
            ontext:onText
        }, { decodeEntities: true });
  
        /* public funcs */
  
        this.setMediaTypes = mtypes => { 
            types = mtypes; 
        }
        this.write = chunk => { 
            parser.write(chunk); 
        }
        this.end = () => { 
            parser.parseComplete(); 
        }
    }
}

module.exports = ArchiveParser;