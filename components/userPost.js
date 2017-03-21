'use strict';

const http = require('http');
const { PostParser } = require('./parser');

function typeTranslate(tumblrTypeString) {
  return tumblrTypeString.includes('regular') ? 'text' : tumblrTypeString.replace('is_','');
}

module.exports = function(postData,callback){
  var error = null
  var request = null;
  var haltParse = false;
  const parser = new PostParser(postData.type);
  const options = {
    host:postData.host,
    path:postData.type === 'is_video' ? postData.path : postData.path+'/mobile',
    timeout:5000,
    headers:{
      'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    }
  };
  const returnData = {
    link:postData.host+postData.path,
    type:typeTranslate(postData.type),
    postData:null
  };

  parser.on('postData',(data) =>{
    returnData.postData = data;
    request.abort();
    haltParse = true;
    callback(error,returnData); // data found, all good to continue.
  });

  request = http.get(options,(res) => {
    if (res.statusCode !== 200) {
      this.abort();
      
      console.log('error inside postData');
      error = {
        path:options.path,
        type:'responseError',
        msg:res.statusCode+' received.'
      }
      callback(error,returnData); // response error
    }
    res.on('data',(chunk)=> {
      if (!haltParse) parser.write(chunk);
    });
  }).on('error',(e) => {
    console.log('error inside postData');
    this.abort();
    error = {
      path:options.path,
      type:'requestError',
      msg:e.message
    }
    callback(error,returnData); // request error
  });
}
