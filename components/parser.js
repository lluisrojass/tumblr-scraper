'use strict';

const htmlparser2 = require('htmlparser2');
var ee = require('events');


class ArchiveParser extends ee {
  constructor(postTypes){
    super();
    const self = this;
    this.currMediaType = null;
    this.types = []; /* 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(question) 'is_audio'*/
    postTypes.forEach(elem => this.types.push(elem));
    this.parser = null;
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

    this.parser.__proto__.validate = function(c){
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
    }
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
  end(){ this.parser.parseComplete() }
  write(chunk){ this.parser.write(chunk); }
}


class ContentParser extends ee{
  constructor(){
    super();

    const self = this;
    var found = !1;

    this.parser = new htmlparser2.Parser({
      onopentag:function(name,attribs) {
        if (name === 'script' && attribs.type && attribs.type === 'application/ld+json'){
          found = !0;
        }
        return;
      },
      ontext:function(text){
        if( found ){
          self.emit('postData', JSON.parse(text));
          found = !1;
        }
        return;
      }
    },{decodeEntities: true});
  }
  write(chunk){ this.parser.write(chunk) }
  end(){ this.parser.end(); }
}

module.exports.ArchiveParser = ArchiveParser;
module.exports.ContentParser = ContentParser;
