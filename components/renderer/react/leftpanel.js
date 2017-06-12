'use strict';

import React from 'react';
import Config from './config';
import Notification from './notification';

function LeftPanel(props){
  return (
    <div id='left-panel-wrapper'>
     <div id='left-panel'>
       <div id='title-wrapper'>
         <h1 className='vertical-center-contents'>Config</h1>
       </div>
       <div id='config-wrapper'>
          <Config
            startRunning={props.startRunning}
            atStart={props.atStart}
            isRunning={props.isRunning}
            stopRunning={props.stopRunning}
            continueRunning={props.continueRunning}
          />
       </div>
       <Notification
         {...props.notification}
       />
     </div>
   </div>
  )
}

export default LeftPanel;
