'use strict';

const ee = require('events');
const htmlparser2 = require('htmlparser2');
const http = require('http');
/*  emits dateChange, media :parm:link to page, error :param: error message, link */
class Archive extends ee {
  constructor() {
    super();
    var self = this;
    this.date = '';
    /* holds either 'is_photo' 'is_video' 'is_quote' 'is_regular'(text) 'is_chat' 'is_note'(question) 'is_audio'*/
    this.mediaTypes = [];
    this.currMediaType = null;
    this.options = {
      host:'',
      path:'/archive',
      timeout:5000,
      headers:{
        userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chro_this/54.0.2840.98 Safari/537.36'
      }
    };
    this.req = null;
    this.isLastPage = function(){return self.options.path === ''};
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
            this.req = http.get(this.options,this.callback);
            Object.keys(this.requestHandlers).forEach((elem) => this.req.on(elem,reqHandlers[elem].bind(this)));
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
            self.emit('media',{'link':self.options.host+attribs.href,'type':self.currMediaType});
            self.currMediaType = null;
            self.isMediaFound = !1;
          }
          else if (attribs.id && attribs.id === 'next_page_link') {
            self.emit('nextPage',self.options.host+self.options.path)
            self.options.path = attribs.href;
          }
        }
        else if (name === 'h2' && attribs.class && attribs.class === 'date'){
            self.state.isDateFound = !0;
        }
      },
      ontext:function(text){
        if (self.isDateFound && text !== self.date) {
          self.date = text;
          self.isDateFound = !1;
          self.emit('date',text);
        }
      }
    },{decodeEntities: true});
    // utility to filter original posts
    this.parser.__proto__.validate = function(c){
      if (c.includes('is_original')){
        self.mediaTypes.forEach((e)=>{
          if (c.includes(self.mediaTypes[e])){
            self.currMediaType = self.mediaTypes[e];
            return !0;
          }
        });
      }
      return !1;
    };
  }
  get(blogname,type){
    type.forEach((elem) => mediaTypes.push(type[elem]));
    this.options.host=`${blogname}.tumblr.com`;
    this.req = http.get(this.options,this.callback);
    Object.keys(this.requestHandlers).forEach((elem) => this.req.on(elem,reqHandlers[elem].bind(this)));
  }

};
Archive.prototype.requestHandlers = {
  // need to be binded to Archive instance for use
  error: function(e){this.emit('error','error with request')},
  response: function(res){this.options.path = ''}
};

module.exports = Archive;
