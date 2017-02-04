'use strict';

const ee = require('events');
const http = require('http');
const pipeEvents = require('pipe-event');
const ContentParser = require('./parser').ContentParser;

const _parser = new ContentParser();

var get = function(host,path,type,callback){

  const _parser = new ContentParser();

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
    },
    error:{
      type:null,
      msg:''
    },
    pageData:null
  };

  _parser.on('data',(data) =>{
    returnData.pageData = data;
    found = !0;
    callback(false,returnData); // data found, all good to continue.
  });

  http.get(options,(res) => {
    if (res.statusCode !== 200) {
      returnData.error.type = 'responseError';
      returnData.error.msg = '';
      callback(true,returnData); // response error
    }
    res.on('data',(chunk)=> {
      if (!found){
        _parser.write(chunk);
      }
    });
  }).on('error',()=>{
    returnData.error.type = 'requestError';
    returnData.error.msg = '';
    callback(true,returnData); // request error
  });
}

module.exports.get = get;
