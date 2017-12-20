'use strict';

import React from 'react';
import VisibleViewer from '../container/visible-viewer';

class RightPanel extends React.PureComponent {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div id='right-panel-wrapper'>
        <VisibleViewer />
      </div>
    );
  }
}

export default RightPanel;
