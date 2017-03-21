'use strict';

const http = require('http');
const https = require('https');
const ee = require('events');

module.exports = class RequestLoop extends ee {
  constructor() {
    super();
    this.protocol = http;
    const self = this;
    this.req = null;
    this.doesBlogExist = false;
    this.options = {
      host:'',
      path:'',
      timeout:8000,
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
      }
    };
    this.callback = function(res){
      res.setEncoding();
      res.setTimeout(8000,() => console.log('shit'));
      if (res.statusCode !== 200){
        if (res.statusCode === 302){
          self.protocol = https;
          self.continue();
        } else {
        self.emit('responseError',{
                                    'host':self.options.host,
                                    'path':self.options.path,
                                    'message': self.doesBlogExist ?
                                                `Error: ${res.statusCode} Received`
                                               :
                                                'Blog Does Not Exist'
                                  });
        }
        return;
      }
      res.on('data', chunk => self.emit('data',chunk));
      res.on('end',() => {
        if (self.isLastPage() && !self.req.isAborted) self.emit('end');
        else {
          self.req = self.protocol.get(self.options,self.callback);
          self.addHandlers();
          self.req.setTimeout(6000,() => self.req.abort());
        }
      });
    }
    this.requestHandlers = {
      error: function(e){
        console.log(e.code);
        if (e.code === 'ECONNRESET'){
          self.req.abort();
          console.log('caught')
          return;
        }
        const m = e.code === 'ENOTFOUND' ? 'Not able to connect to given address' : e.message;
        self.emit('requestError',{'host':self.options.host,'path':self.options.path,'message':m})
      },
      response: function(){ console.log('response from '+self.options.path), self.options.path = '' },
      abort: function(){ console.log(self.options.host), self.emit('abort') }
    }
  }
  _switchProtocol(){
    if (this.protocol === http) return https;
    return http;
  }
  addHandlers(){
    const self = this;
    Object.keys(this.requestHandlers).forEach(elem => {
      self.req.on(elem,self.requestHandlers[elem]);
    });
  }

  go(blogname, path='/archive'){
    this.options.path = path;
    this.options.host = `${blogname}.tumblr.com`
    if (this.doesBlogExist) this.doesBlogExist = false;

    this.req = this.protocol.get(this.options,this.callback);
    this.req.setTimeout(6000,() => self.req.abort());
    this.addHandlers();
  }

  stop(){ /* not working */
    if (this.req) this.req.abort()
  }

  isLastPage(){
    return '' === this.options.path;
  }

  continue(){
    this.go(this.options.host.substring(0,this.options.host.indexOf('.')), this.options.path);
  }

  addPath(p){
    this.options.path = p;
    if (!this.doesBlogExist) this.doesBlogExist = true;
  }

}
