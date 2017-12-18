'use strict';

import React from 'react';
const {ipcRenderer} = electronRequire("electron");
const ipcTypes = require("../../shared/ipctypes.json");

class Notification extends React.PureComponent {

  constructor(props){
    super(props);
  }
    /*
  componentDidMount(){
    ipcRenderer.on("error", (info) => {
      let message = `${info.msg ? info.msg : "Unidentified Error"}`+
      ` ${info.path ? `(${info.path})` : ""}`;
      this.setState({
        message:message,
        type:1
      });
    })
    .on("warning", () => {
      let message = `Error: ${data.msg ? data.msg : "Unknown Error"} `+
      `@ ${data.path ? data.path : "Unknown Path"}`;
      this.setState({
        message:message,
        type:0
      });
    }).on("timeout", () => {
      this.setState({
        message:"Request Timeout",
        type:0
      });
    }).on("end", () => {
      let message = `Finished Parsin ({this.props.getPostLength()} posts found)`
      this.setState({
        message:message,
        type:2
      });
    });
  } */

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
