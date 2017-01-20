'use strict';

const ee = require('events');
const htmlparser2 = require('htmlparser2');
const http = require('http');
/*  emits dateChange, media, error, link */
module.exports = class Archive extends ee {
  constructor() {
    super();
    var self = this;
    this.date = '';
    this.mediaTypes = [['']];
    const options = {
      host:'',
      path:'/archive',
      timeout:5000,
      headers:{
        userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chro_this/54.0.2840.98 Safari/537.36'
      }
    };
    const reqHandlers = {
      error: function(e){self.emit('error','error with request')},
      response: function(res){self.options.path = ''}
    };

    var req = null;
    var isLastPage = function(){return self.options.path === ''};
    var mediaFound = !1;
    var dateFound = !1;

    const parser = new htmlparser2.Parser({
      onopentag: function(name,attribs) {
        if (name === 'div' && attribs.class && this.validate(attribs.class)) {
          mediaFound = !0;
        }
        else if (name === 'a') {
          if (mediaFound) {
            self.emit('media',attribs.href);
            self.state.mediaFound = !1;
          }
          else if (attribs.id && attribs.id === 'next_page_link') {
            self.emit('nextPage',self.options.path)
            self.options.path = attribs.href;
          }
        }
        else if (name === 'h2' && attribs.class && attribs.class === 'date'){
            self.state.dateFound = !0;
        }
      },
      ontext:function(t){
        if (dateFound && t !== self.date) {
          self.date = t;
          dateFound = !1;
          self.emit('date',d);
        }
      }
    },{decodeEntities: true});
    // utility to filter original posts
    parser.__proto__.validate = function(c){
      if (c.includes('is_original')){
        mediaType.forEach((e)=>{
          if (c.includes(self.mediaType[e])){
            return !0;
          }
        });
      }
      return !1;
    };

    const callback = function(res) {
        if (res.statusCode !== 200){
          self.emit('error','blog archive could not be reached, potential invalid blogname');
          return;
        }
        res.on('data',(chunk) => parser.write(chunk));
        res.on('end',() => {
            if(isLastPage()){
              self.parser.end();
              self.emit('end');
            } else {
              req = http.get(options,callback);
              Object.keys(reqHandlers).forEach((elem) => req.on(elem,reqHandlers[elem]));
            }
        });
    };
    this.get = function(blogname,type){
      type.forEach((elem) => mediaType.push(type[elem]));
      this.options.host=`${blogname}.tumblr.com`;
      req = http.get(options,callback);
      Object.keys(reqHandlers).forEach((elem) => req.on(elem,reqHandlers[elem]));
    }
  }
}
