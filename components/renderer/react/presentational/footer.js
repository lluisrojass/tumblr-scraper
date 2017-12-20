'use strict';

import React from 'react';
import Spinner from "./spinner";

class Footer extends React.PureComponent {
  constructor(props){
    super(props);
  }

  text = () => {
    const {props} = this;
    if (props.isRunning) {
      if (!props.path)
        return "Loading...";
      else {
        if (props.dateDepth) {
          return `${props.path} (${props.dateDepth - now})`;
        } else {
          return `${props.path}`;
        }
      } 
    } else 
      return "";
  }

  genSpinner = () => {
    const {props} = this;
    if (props.isRunning && props.path)
      return <Spinner />
    else 
      return "";
  }

  getClass = () => {
    const {props} = this;
    if (props.isRunning)
      return "footer-blue";
    else 
      return "footer-normal";
  }

  render(){
    return (
      <div className={this.getClass()} id='footer'>
      {this.genSpinner()}
      <div className='footer-request-status'>
        <p className='vertical-center-contents'>
          {this.text()}
        </p>
      </div>
      <div className='footer-posts-status'>
        <div></div>
      </div>
    </div>
    );
  }
}



export default Footer;
