'use strict';

const htmlparser2 = require('htmlparser2');
const ee = require('events');
const supportedVideoSites = require('./supportedSites');

class ArchiveParser extends ee {
  constructor(postTypes){
    super();
    const self = this;
    this.currMediaType = null;
    this.types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(ask) 'is_audio'*/
    postTypes.forEach(elem => this.types.push(elem));
    this.isMediaFound = !1;
    this.isDateFound = !1;
    this.date = '';
    this.parser = new htmlparser2.Parser({
      onopentag: function(name,attribs) {
        if (name === "div" && attribs.class && self.validate(attribs.class)){
          self.isMediaFound = !0;
        }
        else if (name === "a") {
          if (self.isMediaFound && attribs['data-peepr'] ) {
            const d = JSON.parse(attribs['data-peepr'])
            self.emit('post',{'host':`${d.tumblelog}.tumblr.com`,'path':`/post/${d.postId}`,'type':self.currMediaType});
            // clear variables
            self.currMediaType = null;
            self.isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === "next_page_link") {
            self.emit("nextPage",attribs.href); // subscribe to the change in the request loop
          }
        }
        else if (name === "h2" && attribs.class && attribs.class === "date") {
            self.isDateFound = !0;
        }
      },
      ontext:function(t){
        if (self.isDateFound){
            if (t !== self.date){
              self.date = t;
              self.emit('date',self.date);
            }
            self.isDateFound = !1;
        }
      }
    },{decodeEntities: true});
  }

  validate(c) {
    var valid = !1;
    if (c.includes("is_original")){
      this.types.forEach((e) => {
        if (c.includes(e)){
          valid = !0;
          this.currMediaType = e;
        }
      });
    }
    return valid;
  };
  end()        { this.parser.parseComplete() }
  write(chunk) { this.parser.write(chunk);   }
}

class ContentParser extends ee{
  constructor(type){
    super();

    var isJSONWrapperFound = false;
    var isDataEmitted = false;
    const self = this;
    const isLookingForVideo = type === 'is_video' ? !0 : !1;

    var dataManager = {
      set videoURL(url){
        if (this.returnData){ /* ld+json found first */
          this.returnData.video = url;
          self.emit('postData', this.returnData);
          isDataEmitted = true; /* prevent double emit */
        } else this.vidURL = url;
      },
      set semData(ldjson){
        ldjson = JSON.parse(ldjson);
        if (this.vidURL){ /* video URL found before ld+json */
          ldjson.video = this.vidURL;
          self.emit('postData',ldjson);
          isDataEmitted = true; /* prevent double emit */
        } else {
          if (!isLookingForVideo) {
            self.emit('postData',ldjson); /* Not looking for video */
            isDataEmitted = true; /* prevent double emit */
          }
          else this.returnData = ldjson;
        }
      },
      vidURL:null,
      returnData:null,
    }

    this.parser = new htmlparser2.Parser({
      onopentag:function(name,attribs) {
        if (name === 'script' && attribs.type && attribs.type === 'application/ld+json'){
          isJSONWrapperFound = !0;
        }
        if (isLookingForVideo && name === 'iframe' && attribs['src']) {

          const { src } = attribs;
          let terminate = false;
          let siteIndex = 0;
          let urlIsMatched = false;

          while(!terminate){
            if (src.indexOf(supportedVideoSites[siteIndex]) !== -1) { /* faster than regex */
              if (!isDataEmitted) dataManager.videoURL = src;
              urlIsMatched = true;
            }
            siteIndex += 1;
            terminate = !supportedVideoSites[siteIndex] || urlIsMatched;
          }
        }
      },
      ontext:function(text){
        if (isJSONWrapperFound){
          dataManager.semData = text;
          isJSONWrapperFound = !1;
        }
        return;
      }
    },{decodeEntities: true});
  }

  write(chunk){
    this.parser.write(chunk);
  }
  end(){
    this.parser.end();
  }
}

module.exports.ArchiveParser = ArchiveParser;
module.exports.ContentParser = ContentParser;
