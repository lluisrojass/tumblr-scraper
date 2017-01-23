'use strict';

const ee = require('events');
const htmlparser2 = require('htmlparser2');
const http = require('http');
const fs = require('fs');

// emits date (:param; date string), post (:parm: metadata js object with page link and media type),
// error (:param: error message), nextPage (:param: page link), end
class Archive extends ee {
  constructor() {
    super();
    this.initParser();
    var self = this;
    this._date = '';
    /* holds either 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(question) 'is_audio'*/
    this._mediaTypes = [];
    this._currMediaType = null;
    this._options = {
      protocol:"http:",
      host:'',
      path:'/archive',
      timeout:5000,
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chro_this/54.0.2840.98 Safari/537.36'
      }
    };
    this._req = null;
    // flags
    this.isLastPage = function(){return self._options.path === ''};
    this.isMediaFound = !1;
    this.isDateFound = !1;
    this.callback = function(res) {
        if (res.statusCode !== 200){
          self.emit('error','blog archive could not be reached, potential invalid blogname');
          return;
        }
        res.on('data',(chunk) => {
          self.parser.write(chunk);
        });
        res.on('end',() => {
            self.parser.end();
            if(self.isLastPage()){
              self.emit('end');
            } else {
              self._req = http.get(self._options,self.callback);
              Object.keys(self.requestHandlers).forEach((elem) => self._req.on(elem,self.requestHandlers[elem].bind(self)));
            }
        });
    };

  }
  // in proto
  initParser(){
    var self = this;
    var validate = function(c){
      if (c.includes("is_original")){
        self._mediaTypes.forEach((e)=>{
          if (c.includes(self._mediaTypes[e])){
            self._currMediaType = self._mediaTypes[e];
            return !0;
          }
        });
      }
      return !1;
    };
    this.parser = new htmlparser2.Parser({
      onopentag: function(name,attribs) {
        console.log(`${name}: ${attribs}`);
        if (name === "div" && attribs.class && validate(attribs.class)) {
          self.isMediaFound = !0;
        }
        else if (name === "a") {
          if (self.isMediaFound) {
            self.emit("post",{"host":self._options.host,"path":attribs.href,"type":self._currMediaType});
            self._currMediaType = null;
            self.isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === "next_page_link") {
            self._options.path = attribs.href;
            self.emit("nextPage",self._options.path);
          }
        }
        else if (name === "h2" && attribs.class && attribs.class === "date") {

            self.isDateFound = !0;
        }
      },
      ontext:function(text){
        console.log('text: '+text);
        if (self.isDateFound) {
          if (text !== self._date){
            self._date = text;
            self.isDateFound = !1;
            self.emit("date",text);
          }
        }
      }
    },{decodeEntities: true})

  }

  get(blogname,type) {
    type.forEach((elem) => this._mediaTypes.push(elem));
    this._options.host=`${blogname}.tumblr.com`;
    this._req = http.get(this._options,this.callback);
    Object.keys(this.requestHandlers).forEach((elem) => this._req.on(elem,this.requestHandlers[elem].bind(this)));
  }
};
Archive.prototype.requestHandlers = {
  // need to be binded to Archive instance for use
  error: function(e){this.emit('error','error with request',this._options.path)},
  response: function(res){this._options.path = ''}
};

module.exports = Archive;
