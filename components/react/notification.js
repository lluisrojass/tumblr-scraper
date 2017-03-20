import React from 'react';

class Notification extends React.Component{
  constructor(props){
    super(props);
  }
  decideClassName = () => {
    const {isFatal, finalPosition, isRunning} = this.props;
    var shit = 'warning-text';

    if (isFatal && !isRunning && !finalPosition) shit = 'error-text';
    else if (!isFatal && isRunning && !finalPosition) shit = 'warning-text';
    else if (!isFatal && !isRunning && finalPosition)  shit = 'success-text';
    console.log(`"${shit}" isFatal:${isFatal} finalPosition:${finalPosition} isRunning:${isRunning} `);
    return shit;
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
