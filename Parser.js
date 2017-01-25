const htmlparser2 = require('htmlparser2');
const ee = require('events');
/*
  TODO: Figure out reference to Request loop to change the pathname once found
*/

class ArchiveParser extends ee {
  constructor(postTypes){
    super();
    this._currMediaType = null;
    /* holds either 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(question) 'is_audio'*/
    this._types =[];
    postTypes.forEach((elem) => this._types.push(elem));
    this._parser = null;
    this._isMediaFound = !1;
    this._isDateFound = !1;
    this._date = '';
    this._loop = null;
    this._initParser();
  }
  _validate(c) {
    var b = !1;
    if (c.includes("is_original")){
      this._types.forEach((e) => {
        if (c.includes(e)){
          b = !0;
          this._currMediaType = e;
          console.log(e);
        }
      });
    }
    return b;
  };
  end(){ this._parser.end() }
  /*addLoopRef(L){ this.loop = L; }*/
  write(chunk){ this._parser.write(chunk); }
  _initParser(){
    const self = this;
    this._parser = new htmlparser2.Parser({
      onopentag: function(name,attribs) {
        if (name === "div" && attribs.class && self._validate(attribs.class)){
          self._isMediaFound = !0;
        }
        else if (name === "a") {
          if (self._isMediaFound) {
            self.emit('post',{'host':self._loop._options.host,'path':attribs.href,'type':self._currMediaType});
            // clear variables, maybe make method
            self._currMediaType = null;
            self._isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === "next_page_link") {
            //TODO: loose couple
            /*self.loop._options.path = attribs.href;*/
            self.emit("nextPage",/*self.loop._options.path*/ attribs.href);
          }
        }
        else if (name === "h2" && attribs.class && attribs.class === "date") {
            self._isDateFound = !0;
        }
      },
      ontext:function(t){
        if (self._isDateFound && self._date !== t){
          self._date = t;
          self.emit('date',self._date);
          self._isDateFound = !1;
        }
      }
    },{decodeEntities: true});
  }
}

class ContentParser extends ee{

}

module.exports.ArchiveParser = ArchiveParser;
module.exports.ContentParser = ContentParser;
