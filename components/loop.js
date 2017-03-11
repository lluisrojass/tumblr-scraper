

const http = require('http');
const ee = require('events');

module.exports = class RequestLoop extends ee {
  constructor() {
    super();
    const self = this;
    this.req = null;
    this.options = {
      protocol:'http:',
      host:'',
      path:'/archive',
      timeout:9000,
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
      }
    };
    this.callback = function(res){
      res.setEncoding();
      if (res.statusCode !== 200){
        console.log('RES ERROR MESSAGE: ');
        self.emit('responseError',{'host':self.options.host,'path':self.options.path});
        return;
      }
      res.on('data', chunk => self.emit('data',chunk));
      res.on('end',() => {
        if (self.isLastPage()) self.emit('end'),console.log(self.request.aborted);
        else {
          self.req = http.get(self.options,self.callback);
          self.addHandlers();
        }
      });
    }
    this.requestHandlers = {
      error: function(e){ console.log('REQ ERROR MESSAGE: '+e.message), self.emit('requestError',{'host':self.options.host,'path':self.options.path}) },
      response: function(){ self.options.path = '' },
      abort: function(){ console.log('inside loop.js request aborted, now aborting loop.js'), self.emit('abort') }
    }
  }
  addHandlers(){
    const self = this;
    Object.keys(this.requestHandlers).forEach(elem => {
      self.req.on(elem,self.requestHandlers[elem]);
    });
  }
  go(blogname){
    this.options.host = `${blogname}.tumblr.com`
    this.req = http.get(this.options,this.callback);
    this.addHandlers();
  }
  isLastPage(){ return '' === this.options.path; }
  addPath(p){ this.options.path = p }
  // not working, need to use this.req.aborted to return a more useful boolean
  stop(){
    if (this.req) {
      this.req.abort();
      this.options.path = '/archive';
      return true;
    }
    return false
  }
}
