import React from 'react';

class Notification extends React.Component{
  constructor(props){
    super(props);
    this.link = 'https://github.com/lluisrojass/Tumblr-Blog-Scraper';
  }
  decideClassName = () => {
    const {isFatal, finalPosition, isRunning} = this.props;
    if (isFatal && !isRunning && !finalPosition) return 'error-text';
    else if (!isFatal && !isRunning && finalPosition)  return 'success-text';
    else return 'warning-text';
  }
  render(){
    return (
      <div id='notification-wrapper'>
        <p className={'notif-label vertical-center-contents '+this.decideClassName()}>
          {this.props.message+' '}
          <a href='#' onClick={() => this.props.openInBrowser(this.link)}>
             Click here to open issues or contribute to this project.
          </a>
        </p>

      </div>
    )
  }
}

export { Notification };
