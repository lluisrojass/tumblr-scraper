'use strict';

import React from 'react';
import VisiblePostList from "../container/visible-post-list";

class MiddlePanel extends React.PureComponent {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div id='mid-panel-wrapper'>
        <div id='middle-panel'>
          <div className='height100width100 scroll-box' id='keep-bottom'>
            <VisiblePostList />
          </div>
        </div>
      </div>
    );
  }
}

export default MiddlePanel;
