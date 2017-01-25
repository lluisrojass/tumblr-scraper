const http = require('http');
const ee = require('events');

class RequestLoop extends ee {
  constructor(parser) {
    super();
    const self = this;
    this._options = {
      protocol:"http",
      host:'',
      path:'/archive',
      timeout:5000,
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chro_this/54.0.2840.98 Safari/537.36'
      }
    };
    this._callback = function(res){
      res.setEncoding('utf8');
      if (res.statusCode !== 200){
        self.emit('error','blog could not be resolved');
        return;
      }
      res.on('data',(chunk) => parser.write(chunk));
      res.on('end',() => {
        if(this.isLastPage()){
          parser.end();
          self.emit('end');
        } else {
          self.request = http.get(self._options,self._callback);
        }
      });
    }
    // TODO: find ways to pipe events instead of re-emitting a similar one
    this.requestHandlers = {
      error: function(){ self.emit('requestError','request attempt failed, error with request') },
      response: function(){ self._options.path = '' },
      socket: function(){ self.emit('socket')},
      abort: function(){ self.emit('abort') }
    };
    this.go = function(){
      this.request = http.get(self._options,self._callback);
      this.addHandlers(this.request);
    }
  }
  addHandlers(){
    var self = this;
    Object.keys(this.requestHandlers).forEach((elem) => self.request.on(elem,self.requestHandlers[elem].bind(self)));
  }
  isLastPage(){return '' === this._options.path}
}

module.exports = RequestLoop;
