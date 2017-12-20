"use strict";

import React from "react";
import {connect} from "react-redux";
import Config from "../presentational/config";
import {
  startRunningAction,
  stopRunningAction,
  resumeRunningAction,
  onBlogNameCharAction,
  errorNotifAction,
  warnNotifAction
} from "../actions/index.js";

const ipcTypes = require('../../../shared/ipctypes.json');
const {ipcRenderer} = electronRequire('electron');


let mapStateToProps = (state) => {
  return {
    isRunning: state.isRunning,
    atStart: state.atStart,
    blogname: state.blogname,
    sliders: state.sliders
  };
}

let mapDispatchToProps = (dispatch) => {
  console.log("this should only show once");
  ipcRenderer.on('asynchronous-reply', (event, types, data) => {
    switch(types){
      case ipcTypes.START_RESP:
        dispatch(startRunningAction());
        break;
      case ipcTypes.CONT_RESP:
        if (!data.didContinue) 
          dispatch(errorNotifAction("unknown error, could not continue"));
        else 
          dispatch(resumeRunningAction());
        break;
      case ipcTypes.STOP_RESP:
        dispatch(stopRunningAction());
        dispatch(warnNotifAction("paused"));
        break;
    }
  });

  return {
    stopRunning: () => {
      ipcRenderer.send('asynchronous-message', ipcTypes.STOP_REQUEST);
    },
    startRunning: (blogname, sliders) => {
      if (blogname.length === 0){
        dispatch(errorNotifAction("Please enter a blogname"));
        return;
      }
      else if (blogname.length > 32){
        dispatch(errorNotifAction("blogname must be 32 characters or less"));
        return;
      }
      else if (!blogname.exactMatch(/[a-zA-Z0-9]+(\-*[a-zA-Z0-9])*/)) {
        dispatch(errorNotifAction("invalid blogname"));
        return;
      }

      let noSliderSelected = !sliders.reduce((accum, slider) => accum || slider.value, false);

      if (noSliderSelected) {
        dispatch(errorNotifAction("no scrape types selected"));
        return;
      }

      let typeMap = {
        photo: 'is_photo',
        chat: 'is_chat',
        ask: 'is_note',
        video: 'is_video',
        text: 'is_regular'
      };

      let types = Object.keys(sliders).map((sliderKey) => {
        if (sliders[sliderKey].value === true)
          return typeMap[sliderKey];
      });

      ipcRenderer.send('asynchronous-message', ipcTypes.START_REQUEST, {
        blogname: blogname,
        types: types
      });
      
    },
    resumeRunning: () => {
      ipcRenderer.send('asynchronous-message', ipcTypes.CONT_REQUEST);
    },
    onText: (text) => dispatch(onBlogNameCharAction(text)),
  };
}

let VisibleConfig = connect(
  mapStateToProps,
  mapDispatchToProps
)(Config);

export default VisibleConfig;
