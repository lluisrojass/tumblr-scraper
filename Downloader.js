const ee = require('events');
const http = require('http');
const htmlparser2 = require('htmlparser2');

var
/* emits error(:param: message)*/
class downloader extends ee {
  constructor(){
  }
  getParser(type){
    var onopentag = null;
    var ontext = null;
    // use code objects
    switch(type){
      case 'is_photo':
        onopentag
        break;
      case 'is_video':
        break;
      case 'is_quote':
        break;
      case 'is_regular':
        break;
      case 'is_chat':
        break;
      case 'is_note':
        break;
      case 'is_audio':
        break;
      default:
        this.emit('error','invalid media type');
        break;
    }
  }
  download(host,path,type){
    const options = {
      host:host,
      path:path+'/mobile',
      timeout:5000,
      headers:{
        userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chro_this/54.0.2840.98 Safari/537.36'
      }
    };
    const parser = this.getParser(type);
    if (!parser){
      this.emit('error','invalid type');
      return;
    }
    var req = http.get(options,(res)=>{
      if (res.statusCode !== 200){
        emit('error',`cannot reach ${options.host}${options.path}`)
        return;
      }
      res.on('data',(chunk)=>parser.write(chunk));
    });
  }
}
