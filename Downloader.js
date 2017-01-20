const ee = require('events');
const http = require('http');
const htmlparser2 = require('htmlparser2');

var parser = new htmlparser2.Parser({
  onopentag:function(name,attribs){

  }

},{decodeEntities: true})

class downloader extends ee {
  constructor(){
    this.req = null;
    this.options = {
      host:'',
      path:'/archive',
      timeout:5000,
      headers:{
        userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chro_this/54.0.2840.98 Safari/537.36'
      }
    };
  }

  get(filename) {
    var req = http.get(this.options,(res) =>{
      if (res.statusCode !== 200){
        this.emit('error',`${filename} unavailable.`);
      }
      res.on('data',(chunk) => parser.write(chunk))
      res.on('')
    });
  }
}
