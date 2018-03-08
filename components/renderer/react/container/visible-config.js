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
  warningNotifAction
} from "../actions/index.js";

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
    ipcRenderer.on('asynchronous-reply', (event, types, data) => {
        switch(types) {
            case "START_RESPONSE":
                dispatch(startRunningAction());
                break;

            case "CONTINUE_RESPONSE":
                if (!data.didContinue) 
                    dispatch(errorNotifAction("unknown error, could not continue"));
                else 
                    dispatch(resumeRunningAction());
                break;

            case "STOP_RESPONSE":
                dispatch(stopRunningAction());
                break;
        }
    });

    return {
        stopRunning: () => {
            ipcRenderer.send('asynchronous-message', "STOP_REQUEST");
        },
        startRunning: (blogname, sliders) => {
            
            if (blogname.length === 0) {
                dispatch(errorNotifAction("Please enter a blogname"));
                return;
            }

            else if (blogname.length > 32) {
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

            let types = [];
            if (sliders[0].value === true) {
                types = ['is_photo','is_chat','is_note','is_video','is_regular'];
            } else {
                for (var i  = 0 ; i < sliders.length ; ++i) {
                    if (i === 0)
                        continue;
                    else if (sliders[i].value === true) 
                        types.push(typeMap[sliders[i].name]);
                }
            }

            ipcRenderer.send('asynchronous-message', "START_REQUEST", {
                blogname: blogname,
                types: types
            });
        
        },
        resumeRunning: () => ipcRenderer.send('asynchronous-message', "CONTINUE_REQUEST"),
        onText: (text) => dispatch(onBlogNameCharAction(text)),
    };
}

let VisibleConfig = connect(
  mapStateToProps,
  mapDispatchToProps
)(Config);

export default VisibleConfig;
