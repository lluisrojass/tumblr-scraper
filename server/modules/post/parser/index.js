const HtmlParser = require('htmlparser2');
const { EventEmitter } = require('events');
const log = require('electron-log');
const { postData, videoData } = require('./markup');
const stateUtils = require('./stateUtils');
const { tumblrTypes: { video: videoType } } = require('../../../config');
/**
 * Parsers an individual post's html
 * content for post information.
 * 
 * @event PostParser#post - contains all found 
 * post information
 */
class PostParser extends EventEmitter {
    constructor(type) {
        super();

        const IS_VIDEO = type === videoType;
        let state = stateUtils.reset({});

        const isEmitReady = () => 
            stateUtils.isPostFound(state) && 
            (IS_VIDEO ? stateUtils.isVideoFound(state) : true);

        const post = {
            isVideo: IS_VIDEO
        };

        let pseg = '';

        const onOpenTag = (name, attribs) => {
            if (
                name === postData.tag &&
                attribs.type === postData.type
            ) {
                /* json-ld schema */
                /* concise (and convenient) summary of post */
                state = stateUtils.postIdentified(state);
            }
            else if (
                IS_VIDEO && 
                name === videoData.tag &&
                attribs.property === videoData.property &&
                attribs.content
            ) {
                post.videoURL = attribs.content;
                state = stateUtils.setVideoFound(state);
            }
            else if (
                IS_VIDEO &&
                stateUtils.isPostFound(state) &&
                name === 'body'
            ) {
                /* reached <body />, no more info to collect */
                if (!isEmitReady())
                    this.emit('post', post);
            }
        }

        const onText = text => {
            if (stateUtils.isPostIdentified(state)) {
                pseg += text;
                try {
                    Object.assign(post, JSON.parse(pseg));
                } 
                catch (err) {
                    /* segmented response */
                    /* ignore and re-add */
                    if (err instanceof SyntaxError) {
                        log.verbose('Encountered segmented JSON in post response');
                        return;
                    }
                    
                    throw err;
                }

                state = stateUtils.postUnidentified(stateUtils.setPostFound(state));

                if (isEmitReady()) {
                    this.emit('post', post);
                }
            }
        }

        const parser = new HtmlParser.Parser({
            onopentag: onOpenTag,
            ontext: onText
        }, { decodeEntities: true });

        this.write = chunk => {
            parser.write(chunk);
        };

        this.end = () => {
            parser.parseComplete();
        };
    }
}

module.exports = PostParser;