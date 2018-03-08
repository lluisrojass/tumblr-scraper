'use strict';

import React from 'react';
import VisibleNotification from '../container/visible-notification';
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
           <h1 className='vertical-center-contents'>Options</h1>
         </div>
         <div id='config-wrapper'>
            <VisibleConfig />
         </div>
       </div>
     </div>);
  }
}


export default LeftPanel;
