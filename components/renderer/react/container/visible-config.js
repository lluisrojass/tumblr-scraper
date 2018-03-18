"use strict";
// imports
import React from "react";
import {connect} from "react-redux";
import Config from "../presentational/config";
import {
    errorNotifAction,
    onBlogNameCharAction
} from "../actions/";

// require
const {ipcRenderer} = electronRequire('electron');


const mapStateToProps = (state) => ({
    isRunning: state.isRunning,
    atStart: state.atStart,
    blogname: state.blogname,
    sliders: state.sliders
});


const mapDispatchToProps = (dispatch) => ({
    stopRunning: () => ipcRenderer.send('asynchronous-message', "STOP_REQUEST"),
    resumeRunning: () => ipcRenderer.send('asynchronous-message', "CONTINUE_REQUEST"),
    onText: text => dispatch(onBlogNameCharAction(text)),
    startRunning: (blogname, sliders) => {
        
        if (blogname.length === 0) {
            dispatch(errorNotifAction("Enter a Blog Name"));
            return;
        }

        else if (blogname.length > 32) {
            dispatch(errorNotifAction("Blog Name must be 32 characters or less"));
            return;
        }

        else if (!blogname.exactMatch(/[a-zA-Z0-9]+(\-*[a-zA-Z0-9])*/)) {
            dispatch(errorNotifAction("Invalid Blog Name"));
            return;
        }

        let noSliderSelected = !sliders.reduce((accum, slider) => accum || slider.value, false);

        if (noSliderSelected) {
            dispatch(errorNotifAction("No Types Selected"));
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
            for (let i = 0 ; i < sliders.length ; ++i) {
                if (i === 0)
                    continue;
                else if (sliders[i].value === true) 
                    types.push(typeMap[sliders[i].name]);
            }
        }

        ipcRenderer.send('asynchronous-message', "START_REQUEST", { blogname, types });
    }
});

const VisibleConfig = connect(mapStateToProps, mapDispatchToProps)(Config);

export default VisibleConfig;
