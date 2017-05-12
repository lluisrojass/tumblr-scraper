import React from 'react';

function Footer(props){
  return(
    <div className={props.isRunning ? 'footer-blue' : 'footer-normal'} id='footer'>
      <Spinner isRunning={props.isRunning} />
      <div className='footer-request-status'>
        <p className='vertical-center-contents'>
          {
            props.requestDepth &&
              'Requesting.. '+props.requestDepth+' '
          }
          {
            props.dateDepth &&
              '('+props.dateDepth+')'
          }
        </p>
      </div>
      <div className='footer-posts-status'>
        <div>
          <p className='vertical-center-contents'>
            {
              props.isRunning && props.postCount &&
                props.postCount+' Posts'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

function Spinner(props){
  return(
    <div className={`sk-fading-circle vertical-center-contents ${props.isRunning ? '':'invisible'}`}>
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
