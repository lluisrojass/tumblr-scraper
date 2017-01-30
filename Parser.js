const htmlparser2 = require('htmlparser2');
const ee = require('events');

class ArchiveParser extends ee {
  constructor(postTypes){
    super();
    const self = this;
    this._currMediaType = null;
    /* holds either 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(question) 'is_audio'*/
    this._types =[];
    postTypes.forEach((elem) => this._types.push(elem));
    this._parser = null;
    this._isMediaFound = !1;
    this._isDateFound = !1;
    this._date = '';
    // main parser
    this._parser = new htmlparser2.Parser({
      onopentag: function(name,attribs) {
        if (name === "div" && attribs.class && self._validate(attribs.class)){
          self._isMediaFound = !0;
        }
        else if (name === "a") {
          if (self._isMediaFound && attribs['data-peepr'] ) {
            const d = JSON.parse(attribs['data-peepr'])
            self.emit('post',{'href':`www.${d.tumblelog}.tumblr.com/post/${d.postId}`,'type':self._currMediaType});
            // clear variables
            self._currMediaType = null;
            self._isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === "next_page_link") {
            self.emit("nextPage",attribs.href); // subscribe to the change in the request loop
          }
        }
        else if (name === "h2" && attribs.class && attribs.class === "date") {
            self._isDateFound = !0;
        }
      },
      ontext:function(t){
        if (self._isDateFound){
            if (t !== self._date){
              self._date = t;
              self.emit('date',self._date);
            }
            self._isDateFound = !1;
        }
      }
    },{decodeEntities: true});
  }
  _validate(c) {
    var b = !1;
    if (c.includes("is_original")){
      this._types.forEach((e) => {
        if (c.includes(e)){
          b = !0;
          this._currMediaType = e;
        }
      });
    }
    return b;
  };
  end(){ this._parser.end() }
  write(chunk){ this._parser.write(chunk); }
}


// For Parsing data from post pages
class ContentParser extends ee{
  constructor(){
    const self = this;
    let found = !1;
    this._parser = new htmlparser2.Parser({
      onopentag:function(name,attribs){
        if(name === 'meta' && attribs.type && attribs.type === 'application/ld+json'){
          found = !0;
        }
      },
      ontext:function(t){
        if(found){
          self.emit('data',JSON.parse(t));
          this._parser = null; // de-reference
        } else {
          return;
        }
      }
    },{decodeEntities: true});
  }
  write(chunk){
    this._parser.write(chunk)
  }
}

module.exports.ArchiveParser = ArchiveParser;
module.exports.ContentParser = ContentParser;
