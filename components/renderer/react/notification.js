'use strict';

import React from 'react';
const {ipcRenderer} = electronRequire("electron");
const ipcTypes = require("../../shared/ipctypes.json");

class Notification extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      message:"",
      type:0 /* 0 = warning, 1 = error, 2 = success */
    }
  }

  componentDidMount(){
    /* ipc handler for loop error */
    ipcRenderer.on("error", (info) => {
      let message = `${info.msg ? info.msg : "Unidentified Error"}`+
      ` ${info.path ? `(${info.path})` : ""}`;
      this.setState({
        message:message,
        type:1
      });
    })
    /* ipc handler for loop warning */
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

    ipcRenderer.on('asynchronous-reply', (event, types, data) => {
      let message="",type=0;
      switch(types) {
        /* loop continued */
        case ipcTypes.CONT_RESP:
          message = data.didContinue ? 'Continued' : 'Could not continue';
          type = data.didContinue ? 0 : 1;
          this.setState({ message:message, type:type });
          break;

        /* loop stopped */
        case ipcTypes.STOP_RESP:
          let dateDepth = this.props.getDateDepth();
          message = `${this.props.getPostLength()} Posts (${dateDepth !== "" ? dateDepth : "start" } - now)`;
          this.setState({ message:message, type:type });
          break;
      }
    });
  }

  type(){
    switch(this.state.type){
      case 0: return 'warning-text';
      case 1: return 'error-text';
      case 2: return 'success-text';
    }
  }

  render(){
    return(
      <div id='notification-wrapper'>
        <p className={'notif-label vertical-center-contents ' + this.type()}>
          {this.state.message}
        </p>
      </div>
    )
  }
}

export default Notification;
