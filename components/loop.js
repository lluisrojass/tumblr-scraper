

const http = require('http');
const ee = require('events');

module.exports = class RequestLoop extends ee {
  constructor() {
    super();
    const self = this;
    this.req = null;
    this.doesBlogExist = false;
    this.options = {
      protocol:'http:',
      host:'',
      path:'',
      timeout:8000,
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
      }
    };
    this.callback = function(res){
      res.setEncoding();
      if (res.statusCode !== 200){
        self.emit('responseError',{
                                    'host':self.options.host,
                                    'path':self.options.path,
                                    'message': self.doesBlogExist ?
                                                `Error: ${res.statusCode} Received`
                                               :
                                                'Blog Does Not Exist'
                                  });
        return;
      }
      res.on('data', chunk => self.emit('data',chunk));
      res.on('end',() => {
        if (self.isLastPage()) self.emit('end');
        else {
          self.req = http.get(self.options,self.callback);
          self.addHandlers();
        }
      });
    }
    this.requestHandlers = {
      error: function(e){ self.emit('requestError',{'host':self.options.host,'path':self.options.path,'message':e.message}) },
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
  go(blogname, path='/archive'){
    this.options.path = path;
    this.options.host = `${blogname}.tumblr.com`
    console.log('happened with '+blogname+path);
    if (this.doesBlogExist) this.doesBlogExist = false;

    this.req = http.get(this.options,this.callback);
    this.addHandlers();
  }


  stop()       { if (this.req) this.req.abort() } /* not working */
  isLastPage() { return '' === this.options.path }
  continue(){
    this.go(this.options.host.substring(0,this.options.host.indexOf('.')), this.options.path)
  }
  addPath(p){
    this.options.path = p;
    if (!this.doesBlogExist) this.doesBlogExist = true;
  }
}
