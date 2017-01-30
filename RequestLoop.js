const http = require('http');
const ee = require('events');

class RequestLoop extends ee {
  constructor(parser) {

    super();

    const self = this;

    this._options = {
      protocol:"http:",
      host:"",
      path:"/archive",
      timeout:5000,
      headers:{
        "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
      }
    };

    this._callback = function(res){
      res.setEncoding('utf8');
      if (res.statusCode !== 200){
<<<<<<< HEAD
        self.emit('responseError',self._options.host+self._options.path);
=======
        self.emit('requestError','blog could not be resolved');
>>>>>>> 9647a7d1bb26110239ccdccb361f22afd61a8081
        return;
      }
      res.on('data',(chunk) => parser.write(chunk));
      res.on('end',() => {
        parser.end();
        if(self.isLastPage()){
          self.emit('end');
        } else {
          self.request = http.get(self._options,self._callback);
          self._addHandlers();
        }
      });
    }
<<<<<<< HEAD

    this._requestHandlers = {
      error: function(){ self.emit('requestError',self._options.host+self._options.path)},
=======
    // TODO: find ways to pipe events instead of re-emitting a similar one
    this._requestHandlers = {
      error: function(){ self.emit('requestError','request attempt failed, error with request') },
>>>>>>> 9647a7d1bb26110239ccdccb361f22afd61a8081
      response: function(){ self._options.path = '' },
      abort: function(){ self.emit('abort') }
    };
  }
  _addHandlers(){
    const self = this;
    Object.keys(this._requestHandlers).forEach((elem) => self.request.on(elem,self._requestHandlers[elem]));
  }
  go(blogName){
    this._options.host = `${blogName}.tumblr.com`
    this.request = http.get(this._options,this._callback);
    this._addHandlers();
  }
  isLastPage(){
    return '' === this._options.path;
  }
  addPath(p){
    return this._options.path = p, void(0);
  }
}

module.exports = RequestLoop;
