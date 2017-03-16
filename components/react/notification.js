import React from 'react';

function Notification(props){
  return(
    <div id='notification-wrapper'>
      <p className={'notif-label ' +
                    (props.isFatal ?
                      'error-text'
                    :
                      'warning-text'
                    )}>
        {props.message}
      </p>
    </div>
  )
}

export { Notification };
