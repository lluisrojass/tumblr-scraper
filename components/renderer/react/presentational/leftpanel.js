'use strict';

import React from 'react';
import Config from './presentational/visible-config';
import Notification from './notification';
import VisibleConfig from "../container/visible-config";

class LeftPanel extends React.PureComponent {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div id='left-panel-wrapper'>
       <div id='left-panel'>
         <div id='title-wrapper'>
           <h1 className='vertical-center-contents'>Config</h1>
         </div>
         <div id='config-wrapper'>
            <VisibleConfig />
         </div>
         <Notification
          getDateDepth={this.props.getDateDepth}
          getPostLength={this.props.getPostLength}
         />
       </div>
     </div>);
  }
}


export default LeftPanel;
