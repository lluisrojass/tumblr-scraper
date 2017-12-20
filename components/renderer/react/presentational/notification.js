'use strict';

import React from 'react';

class Notification extends React.PureComponent {

  constructor(props){
    super(props);
  }

  type(){
    switch(this.props.type){
      case 0: return 'warning-text';
      case 1: return 'error-text';
      case 2: return 'success-text';
    }
  }

  render(){
    const {props} = this;
    let typeClass = this.type();
    return(
      <div id='notification-wrapper'>
        <p className={'notif-label vertical-center-contents ' + typeClass}>
          {props.message}
        </p>
      </div>
    )
  }
}

export default Notification;
