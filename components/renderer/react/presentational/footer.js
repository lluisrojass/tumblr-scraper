'use strict';

import React from 'react';
import Spinner from "./spinner";

class Footer extends React.PureComponent {
  constructor(props){
    super(props);
  }

  genSpinner = () => {
    const {props} = this;
    if (props.isRunning && !props.completed && props.path)
      return <Spinner />
    else 
      return "";
  }

  getStatus = () => {
    const {props} = this;
    if (props.completed)
        return "Finished";
    else if (props.isRunning && props.path)
        return "Running...";

    else if (props.isRunning) {
        return "Loading..."
    }
    else
        return "Paused";
  }

  getClass = () => {
    const {props} = this;
    if (props.completed) 
      return "footer-completed";
    else if (props.isRunning)
      return "footer-blue";
    else if (!props.atStart)
      return "footer-paused";
    else
      return "footer-normal";
  }

  render(){
    const {props} = this;
    
    if (!props.completed && !props.isRunning && props.atStart)
        return (
            <div className={this.getClass()} id='footer'>
                <div className='footer-request-status'>
                    <div className="footer-info-cell-90 vertical-center-contents">
                    </div>
                    <div className="footer-info-cell-10 vertical-center-contents t-cell">
                        <label id="throttlelabel" onClick={props.onThrottleChange} className={props.isThrottle ? "throttle-on" : "throttle-off"}>
                            Throttle: {props.isThrottle ? "on" : "off"}
                        </label>
                    </div>
                </div>
            </div>
        );

    return (
      <div className={this.getClass()} id='footer'>
        <div className='footer-request-status'>
            
            <div className="footer-info-cell-10 vertical-center-contents">
                <p>Status: {this.getStatus()}</p> 
            </div>
            
            <div className="footer-info-cell-30 vertical-center-contents">
                <p>Requesting: {props.path}</p> 
            </div>
            <div className="footer-info-cell-20 vertical-center-contents">
                <p>Posts Discovered: {props.numPosts}</p>
            </div>
            <div className="footer-info-cell-30 vertical-center-contents">
                <p>Depth: {props.dateDepth}</p>
            </div>
            <div className="footer-info-cell-10 vertical-center-contents t-cell">
                <label id="throttlelabel" onClick={props.onThrottleChange} className={props.isThrottle ? "throttle-on" : "throttle-off"}>
                    Throttle: {props.isThrottle ? "on" : "off"}
                </label>
            </div>
            
        </div>
    </div>
    );
  }
}



export default Footer;
