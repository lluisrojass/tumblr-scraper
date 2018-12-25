'use strict';

const HtmlParser = require('htmlparser2');
const Emitter = require('events');
const { parse } = require('url');
const { TUMBLR, MAIN_EVENTS } = require('../shared/constants');

function matchType(types, classString) {
    for (let index in types) {
        const type = types[index];

        if (classString.includes(type)) {
            return type;
        }
    }

    return false;
}

class Parser extends Emitter {

    constructor(types, blogName) {
        super();

        let postType = null;

        const onOpenTag = (name, attribs) => {

            if (
                name === 'div' && 
                attribs.class && 
                typeof attribs.class === 'string' && 
                attribs.class.match(/is_original/)
            ) {
                const type = matchType(types, attribs.class);

                if (type) {
                    postType = type;
                }

            }

            else if (name === 'a') {
                if (
                    attribs.id && 
                    attribs.id === TUMBLR.PARSE_FLAGS.NEXT_PAGE
                ) {
                    const safeHref = attribs.href || '';
                    const match = safeHref.match(/^\/archive\?before_time=(\d+)$/i);
                    const [,stamp] = match || [];
                    
                    if (!stamp) {
                        return;
                    }

                    const s = Number(stamp);

                    if (isNaN(s)) {
                        return;
                    }
         
                    const date = new Date(s).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });

                    this.emit(MAIN_EVENTS.LOOP.DATE,{ date });
                }
                else if (postType && attribs.href) {
                    try {
                        const { pathname } = parse(attribs.href);

                        this.emit(MAIN_EVENTS.LOOP.POST, {
                            pathname,
                            type: postType,
                            blogName: blogName
                        });

                        postType = null;

                    } catch (err) {
                        /* could not prase href SETUP LOG */
                        console.log(`error, could not parse href for ${attribs.href}`);
                    }
                }
            }
        };

        const parser = new HtmlParser.Parser({
            onopentag: onOpenTag
        }, { decodeEntities: true });

        this.write = parser.write;
        this.end = () => {
            parser.parseComplete();
        };

    }
	
}

module.exports = Parser;