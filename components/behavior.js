const $ = require('jquery');
const Archive = require('./archive');

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
