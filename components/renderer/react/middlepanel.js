'use strict';

import React from 'react';
import Post from './post';


class MiddlePanel extends React.PureComponent {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div id='mid-panel-wrapper'>
        <div id='middle-panel'>
          <div className='height100width100 scroll-box' id='keep-bottom'>
            {this.props.scrapedPosts.size > 0 ?
               this.props.scrapedPosts.map((scrapedPost, index) =>
                 <Post
                   onClick={this.props.handlePostClicked}
                   isClicked={this.props.isClicked}
                   key={index}
                   index={index}
                   {...scrapedPost}
                   onLoad={this.props.onLoad}
                 />)
               :
                 <div className='height100width100 notfound'></div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default MiddlePanel;
