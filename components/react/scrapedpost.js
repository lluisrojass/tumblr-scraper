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
       <p className='post-body'>{props.body.bodyShorten()}</p>
     </div>
   </div>
  )
}
