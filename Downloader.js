const ee = require('events');
const http = require('http');
const htmlparser2 = require('htmlparser2');

var
/* emits error(:param: message)*/
class downloader extends ee {

  /*returns JSON object with data from post*/
  download(host,path,type){

    var data = {
      type:'',
      items:[]
    };

    const options = {
      host:host,
      path:path+'/mobile',
      timeout:5000,
      headers:{
        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
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

  getParser(type){
    var onopentag = null;
    var ontext = null;
    // use code objects
    switch(type){
      case 'is_photo':
        onopentag = function(name,attribs){
          if (name === 'meta' && attribs.property && attribs.property === 'og:image'){
            // work into adding to a stack and flushing
          }
        }
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
        return void this.emit('error','invalid media type');
        break;
    }
  }
}
