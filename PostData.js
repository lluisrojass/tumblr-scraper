const ee = require('events');
const http = require('http');
const pipeEvents = require('pipe-events');
const ContentParser = require('./Parser').ContentParser;

/* emits error(:param: message,:param: attempted URL path)*/
class postData extends ee {
  /*returns JSON object with data from post*/
  get(host,path,type){

    const returnData = {
      href:host+path,
      type:type
    };

    const options = {
      host:host,
      path:path+'/mobile',
      timeout:5000,
      headers:{
        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
      }
    };

    pipeEvents('data',self._parser,this);

    http.get(options,(res){
      if (res.statusCode !== 200){
        this.emit('error','status code '+res.statusCode);
      }
      res.on('data'(chunk)=> this._parser.write(chunk));
    }).on('error',()=>this.emit('requestError'));


  }
}
postData.prototype._parser = new ContentParser();
