'use strict';

import React from 'react';
import Config from './config';
import Notification from './notification';

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
            <Config
              startRunning={this.props.startRunning}
              atStart={this.props.atStart}
              isRunning={this.props.isRunning}
              stopRunning={this.props.stopRunning}
              continueRunning={this.props.continueRunning}
            />
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
