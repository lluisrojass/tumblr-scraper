const $ = require('jQuery');

$(document).on('click','.button',(e) =>{
  $('form').submit();
});

$(document).on('change','input[type="checkbox"][name="all"]',function(e){
  if(this.checked) {
    $('p.indiv-type').each(function(e){
      $(this).addClass('grey');
    });
    $('input[name!="all"]').each(function(e){
      $(this).attr('checked',false);
    });
  } else {
    $('p.indiv-type').each(function(e){
      $(this).removeClass('grey');
    });
  }
});

$(document).on('change','input[name!="all"][type="checkbox"]',function(e){
  if($('input[name="all"]').prop('checked') === true){
    $(this).attr('checked',false)
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
  // validate blogname
  if(exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
    alert('valid');
    e.preventDefault();
  }

  // submit and start the loop.
  //alert('all good: '+blogname+' => '+translations.toString());
  e.preventDefault();
});

function exactMatch(r,str){
  const match = str.match(r);
  console.log('match!! => '+match[0]);
  return match != null && str == match[0];
}
