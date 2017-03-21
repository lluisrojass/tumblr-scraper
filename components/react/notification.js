import React from 'react';

class Notification extends React.Component{
  constructor(props){
    super(props);
  }
  decideClassName = () => {
    const {isFatal, finalPosition, isRunning} = this.props;
    if (isFatal && !isRunning && !finalPosition) return 'error-text';
    else if (!isFatal && isRunning && !finalPosition) return 'warning-text';
    else if (!isFatal && !isRunning && finalPosition)  return 'success-text';
    else return 'warning-text'
  }
  render(){
    return(
      <div id='notification-wrapper'>
        <p className={'notif-label vertical-center-content '+this.decideClassName()}>
          {this.props.message}
        </p>
      </div>
    )
  }
}

export { Notification };
