'use strict';

import React from 'react';
import VisibleFooter from '../container/visible-footer';
import RightPanel from './rightpanel';
import MiddlePanel from './middlepanel';
import LeftPanel from './left-panel';

class Application extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div className='height100width100' id='wrapper'>
        <div id='content'>
          <LeftPanel />
          <MiddlePanel />
          <RightPanel />
      </div>
      <VisibleFooter />
    </div>
    )
  }
}

export default Application;
