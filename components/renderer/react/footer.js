import React from 'react';

function Footer(props){
  return(
    <div className={props.isRunning ? 'footer-blue' : 'footer-normal'} id='footer'>
      {props.isRunning && props.requestDepth && <Spinner />}
      <div className='footer-request-status'>
        <p className='vertical-center-contents'>
          {props.requestDepth && props.isRunning && 'Requesting.. '+props.requestDepth+' '}
          {props.isRunning && !props.requestDepth && 'Loading...'}
          {props.dateDepth && props.isRunning && '('+props.dateDepth+')'}
        </p>
      </div>
      <div className='footer-posts-status'>
        <div>
          <p className='vertical-center-contents'>
            {
              props.isRunning && props.postCount &&
                props.postCount+' Scraped Posts'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

function Spinner(){
  return(
    <div className={`sk-fading-circle vertical-center-contents`}>
      <div className="sk-circle1 sk-circle"></div>
      <div className="sk-circle2 sk-circle"></div>
      <div className="sk-circle3 sk-circle"></div>
      <div className="sk-circle4 sk-circle"></div>
      <div className="sk-circle5 sk-circle"></div>
      <div className="sk-circle6 sk-circle"></div>
      <div className="sk-circle7 sk-circle"></div>
      <div className="sk-circle8 sk-circle"></div>
      <div className="sk-circle9 sk-circle"></div>
      <div className="sk-circle10 sk-circle"></div>
      <div className="sk-circle11 sk-circle"></div>
      <div className="sk-circle12 sk-circle"></div>
    </div>
  )
}

export default Footer;
