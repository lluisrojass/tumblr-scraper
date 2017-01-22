'use strict';

const ee = require('events');
const htmlparser2 = require('htmlparser2');
const http = require('http');
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

  }
  // in proto
  callback(res) {
      if (res.statusCode !== 200){
        this.emit('error','blog archive could not be reached, potential invalid blogname');
        return;
      }
      res.on('data',(chunk) => parser.write(chunk));
      res.on('end',() => {
          if(isLastPage()){
            this.parser.end();
            this.emit('end');
          } else {
            this._req = http.get(this._options,this.callback);
            Object.keys(this.requestHandlers).forEach((elem) => this._req.on(elem,reqHandlers[elem].bind(this)));
          }
      });
  };
  initParser(){
    var self = this;
    this.parser = new htmlparser2.Parser({
      onopentag: function(name,attribs) {
        if (name === 'div' && attribs.class && this.validate(attribs.class)) {
          self.mediaFound = !0;
        }
        else if (name === 'a') {
          if (self.isMediaFound) {
            self.emit('post',{'link':self._options.host+attribs.href,'type':self._currMediaType});
            self._currMediaType = null;
            self.isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === 'next_page_link') {
            self.emit('nextPage',self._options.host+self._options.path)
            self._options.path = attribs.href;
          }
        }
        else if (name === 'h2' && attribs.class && attribs.class === 'date'){
            self.isDateFound = !0;
        }
      },
      ontext:function(text){
        if (self.isDateFound && text !== self._date) {
          self._date = text;
          self.isDateFound = !1;
          self.emit('date',text);
        }
      }
    },{decodeEntities: true});
    // utility to filter original posts
    this.parser.__proto__.validate = function(c){
      if (c.includes('is_original')){
        self._mediaTypes.forEach((e)=>{
          if (c.includes(self._mediaTypes[e])){
            self._currMediaType = self._mediaTypes[e];
            return !0;
          }
        });
      }
      return !1;
    };
  }
  get(blogname,type){
    type.forEach((elem) => this._mediaTypes.push(type[elem]));
    this._options.host=`${blogname}.tumblr.com`;
    this._req = http.get(this._options,this.callback);
    Object.keys(this.requestHandlers).forEach((elem) => this._req.on(elem,reqHandlers[elem].bind(this)));
  }
};
Archive.prototype.requestHandlers = {
  // need to be binded to Archive instance for use
  error: function(e){this.emit('error','error with request')},
  response: function(res){this._options.path = ''}
};

module.exports = Archive;
