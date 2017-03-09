import React from 'react';

function Post(props){
  return(
    <div className='post'>
     <div className='image-wrapper'>
       {
         props.images.length > 0 ?
          <img src={props.images[0]} className='post-image' />
         :
          <img src={`public/img/${props.mediaType}_default.png`} className='post-image' />
       }
     </div>
     <div className='post-content'>
       <div className='post-headline'>
         <h1 className='post-title'>{props.headline.headlineShorten()}</h1>
         <h1 className='post-date'>{props.datePublished.dateShorten()}</h1>
       </div>
       <p className='post-body'>{props.articleBody.bodyShorten()}</p>
     </div>
   </div>
  )
}

function Date(props){
  return(
    <div className='date-wrapper'>
      <h1>{props.date}</h1>
    </div>
  );
}
export {Date, Post};
