const HtmlParser = require('htmlparser2');
const { EventEmitter } = require('events');
const { parse } = require('url');
const { originalPost, nextPage } = require('./markup');
const { toFormattedDate } = require('./utils');
/**
 * Parsers an archive for post information.
 * 
 * @event ArchiveParser#post - fired when a user
 * uploaded post is encountered. callback is invoked
 * with request information useful for creating an 
 * http request to view the post.
 * @event ArchiveParser#date - fired when an update
 * is encountered about the date of the depth of the 
 * page. Usually fired after encountering the page event
 * @event ArchiveParser#page - fired when a new page url
 * is found.
 */
class ArchiveParser extends EventEmitter {
    constructor(types, blog) {
        super();
        let postType;

        const onOpenTag = (name, attribs) => {
            if (name === originalPost.containerTag && 
                attribs.class && 
                attribs.class.indexOf(originalPost.containerClass) >= 0) {
                const type = types.find(t => attribs.class.indexOf(t) >= 0);

                if (type) 
                    postType = type;

            }
            else if (attribs.href) {
                if (name === nextPage.tag && attribs.id === nextPage.id) {
                    this.emit('page', { path: attribs.href });
                    
                    const [,stamp] = attribs.href.match(/\/archive\?before_time=(\d+)$/i) || [];
                    if (!stamp)
                        return;

                    const msStamp = (stamp >>> 0) * 1000;
                    const safeStamp = (new Date(msStamp)).getTime();

                    if (Number.isNaN(safeStamp)) 
                        return;

                    this.emit('date', { date: toFormattedDate(safeStamp) });
                }
                else if (postType) {
                    if (originalPost.isAdult(attribs.href)) {
                         /* was banned for nudity */
                         /* for some reason these are */
                         /* all identified as original posts */
                        postType = null;
                        return;
                    }
                    
                    let { path } = parse(attribs.href);
                    if (!path) 
                        return;
                    
                    this.emit('post', {
                        blog,
                        path,
                        type: postType
                    });
                }
            }
        };

        this.on('post', () => { postType = null; });

        const parser = new HtmlParser.Parser(
            { onopentag: onOpenTag },
            { decodeEntities: true }
        );

        this.write = (chunk) => {
            parser.write(chunk);
        };

        this.end = () => {
            parser.parseComplete();
        };

    }
	
}

module.exports = ArchiveParser;