'use strict';

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const supportedVideoSites = require('./supportedSites.json')['sites'];

function debug(text){
  console.log(text);
}

class ArchiveParser extends ee {

  constructor(postTypes){
    super();
    this.currentMediaType = null;
    this.date = '';
    this.types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(ask) 'is_audio'*/
    postTypes.forEach(elem => this.types.push(elem));
    // flags :-(
    this.isMediaFound = false;
    this.isDateFound = false;
  }

  flagCleanup(){ /* cleanup util */
    this.currentMediaType = null;
    this.isMediaFound = false;
  }

  parser = new htmlparser2.Parser({
    onopentag: (name,attribs) => {

      if (name === 'div' && attribs.class && this._validate(attribs.class))
        this.isMediaFound = true;

      else if (attribs.id && attribs.id === 'next_page_link')
        this.emit('nextPage',attribs.href);

      else if (name === 'h2' && attribs.class && attribs.class === 'date')
        this.isDateFound = !0;

      else if (name === 'a') {
        if (this.isMediaFound && attribs['data-peepr'] ) {

          const d = JSON.parse(attribs['data-peepr']);

          this.emit('post',{
                              'host':`${d.tumblelog}.tumblr.com`,
                              'path':`/post/${d.postId}`,
                              'type':this.currentMediaType
                            });

          flagCleanup();
        }
      }


    },
    ontext:(t) => {
      if (this.isDateFound) {
        if (t !== this.date) {
          this.date = t;
          this.emit('date',t);
        }
        this.isDateFound = !1;
      }
    }
  },{decodeEntities: true});

  _validate(c) { /* parsing utility */
    var valid = false;
    if (c.includes('is_original')){
      this.types.forEach((e) => {
        if (c.includes(e)){
          valid = true;
          this.currentMediaType = e;
        }
      });
    }
    return valid;
  };

  end() {
    this.parser.parseComplete();
  }

  write(chunk) {
    this.parser.write(chunk);
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
  }

  parser = new htmlparser2.Parser({
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

  write(chunk) {
    this.parser.write(chunk);
  }

  end() {
    this.parser.parseComplete();
  }
}

module.exports = { ArchiveParser, PostParser };
