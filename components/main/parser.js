'use strict';

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const supportedVideoSites = require('./supportedSites.json')['sites'];

class ArchiveParser extends ee {
  constructor() {
    super();
    var self = this;
    var ptype = null;
    var date = '';
    var pfound = false;
    var dfound = false;
    var types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(ask) 'is_audio'*/
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
            self.emit('post',{ 'url': attribs.href, 'type': ptype });
            ptype = null;
            pfound = false;
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
    this.isJSONWrapperFound = false;
    this.isLookingForVideo = type === 'is_video' ? !0 : !1;
    this.emitMngr = {
      set videoURL(url) {

        if (this.emited) return; /* no-op if already emitted */

        switch(this._d) {
          case null:
            this._vidURL = url;
            break;
          default:
            this._d.video = url;
            self.emit('postData', this._d);
            this.emitted = true;
            break;
        }
      },

      set semJSON(ldjson) {

        if (this.emitted) return; /* no-op if already emitted */

        switch (self.isLookingForVideo) {
          case true:
            if (this._vidURL){
              ldjson.video = this._vidURL;
              self.emit('postData', ldjson);
              this.emitted = true;
            }
            else
              this._d = ldjson;
            break;
          case false:
            self.emit('postData',ldjson);
            this.emitted = true;
            break;
        }
      },

      get emitted(){
        return this._isDataEmitted
      },

      set emitted(b){
        this._isDataEmitted = b;
      },
      // vars
      _vidURL:null,
      _d:null,
      _isDataEmitted:false
    }
    this.parser = new htmlparser2.Parser({
      onopentag:(name, attribs) => {
        if (name === 'script' && attribs.type && attribs.type === 'application/ld+json')
          this.isJSONWrapperFound = !0;

        else if (this.isLookingForVideo && name === 'iframe' && attribs['src']) {

          var { src } = attribs,
              terminate = false,
              siteIndex = 0,
              urlIsMatched = false;

          while( !terminate ) {

            if (src.indexOf(supportedVideoSites[siteIndex]) !== -1) {
              this.emitMngr.videoURL = src.substring(0,4) === 'http' ? src : 'http:'+src; // remove ambiguity
              urlIsMatched = true;
            }

            siteIndex += 1;
            terminate = !supportedVideoSites[siteIndex] || urlIsMatched;
          }
        }
      },
      ontext:(text) => {
        if (this.isJSONWrapperFound) {
          this.emitMngr.semJSON = JSON.parse(text);
          this.isJSONWrapperFound = !1;
        }
        return;
      }
    },
    {decodeEntities: true});
  }



  write(chunk) {
    this.parser.write(chunk);
  }

  end() {
    this.parser.parseComplete();
  }
}



module.exports = { ArchiveParser, PostParser };
