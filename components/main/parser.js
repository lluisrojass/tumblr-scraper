'use strict';

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const videoSites = require('./supportedSites.json')['sites'];
const url = require('url');

class ArchiveParser extends ee {
  constructor() {
    super();
    var self = this;
    var ptype = null;
    var wut = 0;
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
          self.emit('page',{ path: attribs.href });
        else if (name === 'h2' && attribs.class && attribs.class === 'date')
          dfound = true;
        else if (pfound && name === 'a' && attribs.href) {
          let {path, hostname} = url.parse(attribs.href);
          self.emit('post',{ 'host': hostname, 'path':path, 'type': ptype });
          pfound = false;
          ptype = null;
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
    this.setMediaTypes = function(mtypes){
      types = mtypes;
    }
    this.end = function(){
      parser.parseComplete();
    }
    this.write = function(chunk){
      parser.write(chunk);
    }
  }
}

class PostParser extends ee{
  constructor(type){
    super();
    const self = this;
    var jsonFound = false;
    var isVideo = type === 'is_video' ? true : false;
    var videoURL = '';
    var pdata = null;
    var emitted = false;
    var isFinished = function(){
      if (isVideo && pdata && videoURL){
        emitted = true;
        pdata.video = videoURL;
        self.emit('post', pdata);
      }
      else if (!isVideo && pdata){
        emitted = true;
        self.emit('post', pdata);
      }
    }
    const parser = new htmlparser2.Parser({
      onopentag:(name, attribs) => {
        if (name === 'script' && attribs.type && attribs.type === 'application/ld+json')
          jsonFound = true;
        else if (isVideo && name === 'iframe' && attribs['src']) {
          var {src} = attribs;
          var i = 0;
          do {
            if (src.indexOf(videoSites[i++]) !== -1){
              videoURL = src.substring(0,4) === 'http' ? src : 'http:'+src; // new variable.
              isFinished();
              break;
            }
          } while (!videoSites[i]);
        }
      },
      ontext:(text) => {
        if (jsonFound) {
          jsonFound = false;
          pdata = JSON.parse(text);
          isFinished();
        }
        return;
      }
    },
    {decodeEntities: true});

    this.write = function(chunk){
      if (!emitted)
        parser.write(chunk);
    }

    this.end = function(){
      parser.parseComplete();
    }
  }
}

module.exports = { ArchiveParser, PostParser };
