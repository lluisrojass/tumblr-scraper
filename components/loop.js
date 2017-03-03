'use strict';

const http = require('http');
const ee = require('events');

module.exports = class RequestLoop extends ee {
  constructor() {
    super();
    const self = this;
    this.request = null;
    this.options = {
      protocol:"http:",
      host:"",
      path:"/archive",
      timeout:5000,
      headers:{
        "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
      }
    };
    this.callback = function(res){
      res.setEncoding('utf8');
      if (res.statusCode !== 200){
        self.emit('responseError',{'host':self.options.host,'path':self.options.path});
        return;
      }
      res.on( 'data', chunk => self.emit('data',chunk) );
      res.on('end',() => {
        if ( self.isLastPage() ){
          self.emit('end');
        } else {
          self.request = http.get(self.options,self.callback);
          self.addHandlers();
        }
      });
    }
    this.requestHandlers = {
      error: function(){ self.emit('requestError',{'host':self.options.host,'path':self.options.path})},
      response: function(){ self.options.path = '' },
      abort: function(){  self.emit('abort'); }
    }
  }
  addHandlers(){
    const self = this;
    Object.keys(this.requestHandlers).forEach((elem) => self.request.on(elem,self.requestHandlers[elem]));
  }
  go(blogname){
    this.options.host = `${blogname}.tumblr.com`
    this.request = http.get(this.options,this.callback);
    this.addHandlers();
  }
  // utilities
  isLastPage(){ return '' === this.options.path; }
  addPath(p){ this.options.path = p; }
  abort(){ this.request.abort(); }
}
