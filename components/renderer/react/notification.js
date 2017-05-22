import React from 'react';

function Notification(props) {
  const type = ((t) => {
    switch(t){
      case 0:
        return 'warning-text'
      case 1:
        return 'error-text'
      case 2:
        return 'success-text'
    }
  })(props.type);
  return (
    <div id='notification-wrapper'>
      <p className={ 'notif-label vertical-center-contents ' + type }>
        {props.msg + ' '}
      </p>

    </div>
  )
}

export { Notification };
