'use strict';

const http = require('http');
const ContentParser = require('./parser').ContentParser;

function typeTranslate(tumblrTypeString){
  return tumblrTypeString.contains('regular') ? 'text' : tumblrTypeString.replace('is_','');
}

module.exports = function(postData,callback){

  var error = null

  const parser = new ContentParser();
  const options = {
    host:postData.host,
    path:postData.path+'/mobile',
    timeout:5000,
    headers:{
      'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    }
  };
  const returnData = {
    link:postData.host+postData.path,
    type:typeTranslate(type),
    postData:null
  };

  parser.on('data',(data) =>{
    returnData.postData = data;
    isDataFound = !0;
    callback(error,returnData); // data found, all good to continue.
  });

  http.get(options,(res) => {
    if (res.statusCode !== 200) {
      this.abort();
      error = {
        type:'responseError',
        msg:res.statusCode+' status code returned'
      }
      callback(error,returnData); // response error
    }
    res.on('data',(chunk)=> {
      parser.write(chunk);
    });
  }).on('error',(e) => {
    this.abort();
    error = {
      type:'requestError',
      msg:'Error with request: ' + e.message
    }
    callback(error,returnData); // request error
  });
}
