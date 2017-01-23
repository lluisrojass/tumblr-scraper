const ee = require('events');
const http = require('http');
const htmlparser2 = require('htmlparser2');

/* emits error(:param: message,:param: attempted URL path)*/
module.exports = class postData extends ee {
  /*returns JSON object with data from post*/
  get(host,path,type){
    const self = this;
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
    var isFound = !1;
    const parser = new htmlparser2.Parser({
      onopentag:function(name,attribs){
        if (name === 'script' && attribs.type && attribs.type === 'application/ld+json'){ isFound = !0 }
      },
      ontext:function(text){
        if (isFound) {
          returnData.data = JSON.parse(text);
          self.emit('postData',returnData);
          isFound = !1;
        }
      }
    },{decodeEntities: true});

    http.get(options,(res)=>{
      if (res.statusCode !== 200){
        this.emit('error',`response code: ${statusCode}`,path)
        return;
      }
      res.on('data',(chunk)=>parser.write(chunk));
    }).on('error',()=>{
      this.emit('error','unknown error with request',path)
      return;
    });
  }
}
