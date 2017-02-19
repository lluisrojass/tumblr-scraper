/*scraped_data = [{
  type:'post',
  isSet:true,
  imageLinks:['...','...','...'],
  body:'',
  headline:''
},
{
  type:'date',
  dateString:'December 2016'
}]*/



const $ = require('jquery');
const Archive = require('./archive');
import React from 'react';
import ReactDOM from 'react-dom';

const archive = new Archive();

archive.on('date',(date) => {
  var message = "New Date: "+date;
  console.log(message);
  ReactDOM.render(<Youvegotmail/>,document.getElementsByClassName('terminal-scroll')[0])
});
/*
archive.on('nextPage',(path) =>{
  console.log('\x1b[36m%s','Next Archive Page: ' + path,'\x1b[0m')
});
archive.on('post',(data) =>{
  console.log('\x1b[32m%s',`Post Found (${data['type']}): ${data['host']}${data['path']}`,'\x1b[0m');
  getPostData(data['host'],data['path'],data['type'],(err,data) => {
      if (err){
        console.log(data);
        console.log('\x1b[33m%s',`${data.error.type} getting ${data.href}`,'\x1b[0m');
        return;
      }
      console.log('\x1b[30m%s',JSON.stringify(data),'\x1b[0m');
  });
});

archive.on('responseError',(link) =>{
  console.log('\x1b[31m%s',`Response Error getting ${link}`,'\x1b[0m');
});
archive.on('requestError',(link) =>{
  console.log('\x1b[31m%s',`Request Error getting ${link}`,'\x1b[0m');
})
archive.on('end',() =>{
  console.log('\x1b[30m%s',`OVER`,'\x1b[0m');
});*/


$(document).on('click','.button',(e) =>{
  $('form').submit();
});

$(document).on('change','input[type="checkbox"][name="all"]',function(e){
  if(this.checked) {
    $('p.indiv-type').each(function(e){
      $(this).addClass('grey');
    });
    $('input[name!="all"]').each(function(e){
      $(this).prop('checked',false);
    });
  } else {
    $('p.indiv-type').each(function(e){
      $(this).removeClass('grey');
    });
  }
});

$(document).on('click','input[type="checkbox"][name!="all"]',function(e){
  if ($('input[name="all"]').prop('checked')){
    e.preventDefault();
  }
});

$(document).on('submit', 'form', function(e) {
  const translations = ['is_photo','is_chat','is_note','is_video','is_regular'];
  const blogname = e.target[6].value;

  if(!e.target[0].checked){
    for(var i = 1 ; i <= 5 ;i++){
      if(e.target[i].checked){
        translations.splice(i-1,1);
      }
    }
    // if none checked
    if(translations.length === 5){
      blinkChoices();
    }
  }
  //
  // validate blogname
  if(exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
    archive.go(blogname,translations);
  }

  // submit and start the loop.
  e.preventDefault();
});

function exactMatch(r,str){
  const match = str.match(r);
  return match != null && str == match[0];
}
