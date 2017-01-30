'use strict';

const ee = require('events');
const http = require('http');
const pipeEvents = require('pipe-event');
const ContentParser = require('./Parser').ContentParser;

class PostData extends ee {
  /*returns JSON object with data from post*/
  get(host,path,type){

    const self = this;
    let found = !1;

    const options = {
      host:host,
      path:path+'/mobile',
      timeout:5000,
      headers:{
        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
      }
    };

    const returnData = {
      meta:{
        href:options.host+options.path,
        type:type
      }
    };

    self._parser.on('data',(data) =>{
      const d = JSON.parse(JSON.stringify(returnData));

      d.pageData = data;
      found = !0;
      console.log('new d!' + options.host+options.path);
      //self.emit('data',d)
    });

    http.get(options,(res) => {
      if (res.statusCode !== 200)
        this.emit('responseError',options.host+options.path);
      res.on('data',(chunk)=> {
        if (!found){
          this._parser.write(chunk);
        }
      });
    }).on('error',()=>this.emit('requestError',options.host + options.path));

  }
}

PostData.prototype._parser = new ContentParser();


module.exports = PostData;
