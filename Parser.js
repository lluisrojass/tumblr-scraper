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
  }
  _validate(c) {
      if (c.includes("is_original")){
        this._types.forEach((e) => {
          if (c.includes(e)){
            this._currMediaType = e;
            return !0;
          }
        });
      }
    return !1;
  };
  end(){ this._parser.end() }
  addLoopRef(L){ this.loop = L; }
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
            self.emit('post',{'host':self._options.host,'path':attribs.href,'type':self._currMediaType});
            // clear variables, maybe make method
            self._currMediaType = null;
            self._isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === "next_page_link") {
            //TODO: loose couple
            self.loop._options.path = attribs.href;
            self.emit("nextPage",{"path":self._options.path});
          }
        }
        else if (name === "h2" && attribs.class && attribs.class === "date") {
            self._isDateFound = !0;
        }
      },
      ontext:function(t){
        if (self._isDateFound && self.date !== t){
          self.date = t;
        }
      }
    },{decodeEntities: true});
  }
}

class contentParser extends ee{
  
}
