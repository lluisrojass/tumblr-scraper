'use strict';
const htmlparser2 = require('htmlparser2');
const ee = require('events');
const url = require('url');
const videoSites = require('./videoSites.json')['sites'];
const cache = require('./loopcache.json');
/* Parser for loop.js. Events info found in loop.js */





class ArchiveParser extends ee {
  constructor() {
    super();

    var self = this;
    var ptype = null;
    var date = '';
    var pfound = false;
    var dfound = false;
    var types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(ask) 'is_audio' */

    const validClass = function(classStr){
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


    var parser = new htmlparser2.Parser({
      onopentag: (name, attribs) => {
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

          if (hostname.indexOf(cache['blogname']) > -1){  // exists
            (self.emit('post',{ 'host': hostname, 'path':path, 'type':ptype }), pfound = false, ptype = null);
          }
        }

      },
      ontext: (t) => {
        if (dfound) {
          if (t !== date) {
            date = t;
            this.emit('date', { date: date });
          }
          dfound = false;
        }
      }
    },{decodeEntities: true});
    //-- -- -- -- --//
    /* public funcs */
    //-- -- -- -- --//
    this.setMediaTypes = mtypes => { types = mtypes; }
    this.write = chunk => {  parser.write(chunk); }
    this.end = () => { parser.parseComplete(); }


  }
}
/* Parser for userpost.js. Emits 'post' event w/ dict arg with all necessary data. */
class PostParser extends ee{
  constructor(type){
    super();
    const self = this;
    var jsonFound = false;
    var isVideo = type === 'is_video' ? true : false;
    var emitted = false;
    var pseg = '';
    var post = null;
    const parser = new htmlparser2.Parser({
      onopentag:(name, attribs) => {
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
      },
      ontext:(text) => {
        if (jsonFound) {
          try {
            pseg += text;
            post = JSON.parse(pseg);
            jsonFound = false;
            if (!isVideo) { /* if not still looking for video */
              post.isVideo = false;
              self.emit('post', post);
              emitted = true;
            }
          }
          catch (err) {/* segmented, :bool: jsonFound not reset */}
        }
      }
    },
    {decodeEntities: true});
    //-- -- -- -- --//
    /* public funcs */
    //-- -- -- -- --//
    this.write = function(chunk){
      if (!emitted) parser.write(chunk);
    }
    this.end = function(){
      parser.parseComplete();
    }
  }
}

module.exports = { ArchiveParser, PostParser };
