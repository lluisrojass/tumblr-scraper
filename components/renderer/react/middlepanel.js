'use strict';

import React from 'react';
import Post from './post';

function MiddlePanel(props){
  return (
    <div id='mid-panel-wrapper'>
      <div id='middle-panel'>
        <div className='height100width100 scroll-box' id='keep-bottom'>
          {props.scrapedPosts.length > 0 ?
             props.scrapedPosts.map((scrapedPost, index) =>
               <Post
                 onClick={props.handlePostClicked}
                 isClicked={props.isClicked}
                 key={index}
                 index={index}
                 {...scrapedPost}
                 onLoad={props.onLoad}
               />)
             :
               <div className='height100width100 notfound'></div>
          }
        </div>
      </div>
    </div>
  )
}

export default MiddlePanel;
