'use strict';

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const supportedVideoSites = require('./supportedSites.json')['sites'];

class ArchiveParser extends ee {

  constructor(postTypes){
    super();
    this.currentMediaType = null;
    this.isMediaFound = !1;
    this.isDateFound = !1;
    this.date = '';
    this.types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(ask) 'is_audio'*/
    postTypes.forEach(elem => this.types.push(elem));
  }

  parser = new htmlparser2.Parser({
    onopentag: (name,attribs) => {
      if (name === 'div' && attribs.class && this._validate(attribs.class))
        this.isMediaFound = !0;
      else if (name === 'a') {
        if (this.isMediaFound && attribs['data-peepr'] ) {
          const d = JSON.parse(attribs['data-peepr'])
          this.emit('post',{'host':`${d.tumblelog}.tumblr.com`,'path':`/post/${d.postId}`,'type':this.currentMediaType});
          this.currentMediaType = null; /* clear variables */
          this.isMediaFound = !1;
        }
        else if (attribs.id && attribs.id === 'next_page_link') {
          this.emit('nextPage',attribs.href);
        }
      }
      else if (name === 'h2' && attribs.class && attribs.class === 'date') this.isDateFound = !0;
    },
    ontext:(t) => {
      if (this.isDateFound){
          if (t !== this.date){
            this.date = t;
            this.emit('date',this.date);
          }
          this.isDateFound = !1;
      }
    }
  },{decodeEntities: true});

  _validate(c) {
    var valid = !1;
    if (c.includes('is_original')){
      this.types.forEach((e) => {
        if (c.includes(e)){
          valid = !0;
          this.currentMediaType = e;
        }
      });
    }
    return valid;
  };

  end()        { this.parser.parseComplete() }

  write(chunk) { this.parser.write(chunk)    }
}

class PostParser extends ee{
  constructor(type){
    super();
    const self = this;
    this.isJSONWrapperFound = false;
    this.isDataEmitted = false; /* prevent double emit */
    this.isLookingForVideo = type === 'is_video' ? !0 : !1;
    this.emitManager = {
      set videoURL(url){
        if (this._d){ /* ld+json found first */
          this._d.video = url;
          self.emit('postData', this._d);
          this.isDataEmitted = true;
        } else this._vidURL = url;
      },
      set semJSON(ldjson){
        ldjson = JSON.parse(ldjson);
        if (this._vidURL){ /* video URL found before ld+json */
          ldjson.video = this._vidURL;
          self.emit('postData', ldjson);
          this.isDataEmitted = true;
        } else {
          if (!this.isLookingForVideo) {
            self.emit('postData', ldjson); /* Not looking for video */
            this.isDataEmitted = true;
          }
          else this._d = ldjson;
        }
      },
      _vidURL:null,
      _d:null,
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
            if (!this.isDataEmitted)
              this.emitManager.videoURL = src.substring(0,4) === 'http' ? src : 'http:'+src;
            urlIsMatched = true;
          }
          siteIndex += 1;
          terminate = !supportedVideoSites[siteIndex] || urlIsMatched;
        }
      }
    },
    ontext:(text) => {
      if (this.isJSONWrapperFound) {
        this.emitManager.semJSON = text;
        this.isJSONWrapperFound = !1;
      }
      return;
    }
  },{decodeEntities: true});

  write(chunk) { this.parser.write(chunk) }
  
  end()        {  this.parser.end()       }
}

module.exports = { ArchiveParser, PostParser };
