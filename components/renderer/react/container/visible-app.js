"use strict";

// requires 
const { ipcRenderer } = electronRequire('electron');
// imports
import { connect } from "react-redux";
import Application from "../presentational/application";
import { 
    postFoundAction, 
    pathDepthAction, 
    dateDepthAction,
    parseCompleteAction,
    startRunningAction,
    stopRunningAction,
    resumeRunningAction,
    onBlogNameCharAction,
    errorNotifAction,
    warningNotifAction,
    throttleStartAction,
    throttleToggleAction
} from "../actions/index.js";


const mapIPCToDispatch = (dispatch) => {

    /* catch events */

    ipcRenderer.on("post", (event, post) => {
        const bottom = document.getElementById("keep-bottom");
        const keepBottom = bottom.scrollTop+1 >= bottom.scrollHeight - bottom.clientHeight;

        post.isClicked = false;
        
        dispatch(postFoundAction(post));
        
        if (keepBottom) bottom.scrollTop = bottom.scrollHeight - bottom.clientHeight; 
    })

    .on("page", (event, data) => dispatch(pathDepthAction(data.path)))

    .on("date", (event, data) => dispatch(dateDepthAction(data.date)))

    .on("timeout", (event) => dispatch(errorNotifAction("fatal request timeout")))

    .on("end", (event) => dispatch(parseCompleteAction()))

    .on("error", (event, info) => {
        let message = info.message ? info.message : "unknown fatal error";
        message += " ";
        message += info.path ? info.path : " (unknown path)";
        dispatch(errorNotifAction(message));
    })

    .on("warning", (event, info) => {
        let message = info.msg ? info.msg : "unknown nonfatal error encountered";
        message += " ";
        message += info.path ? info.path : " (unknown path)";
        dispatch(warningNotifAction(message));
    })

    /* respond to ipc replies */
    .on("asynchronous-reply", (event, TYPE, data) => {

        switch(TYPE) {
            case "START_RESPONSE":
            dispatch(startRunningAction());
            break;

            case "CONTINUE_RESPONSE":
            if (!data.didContinue)
                dispatch(errorNotifAction("could not continue (unknown error)"));
            else   
                dispatch(resumeRunningAction());
            break;


            case "STOP_RESPONSE":
            dispatch(stopRunningAction());
            break;

            // inits thrott. setting based on preference on other thread
            case "THROTTLE_START":
            
            dispatch(throttleStartAction(data)); 
            break;
            
            case "THROTTLE_RESPONSE":
            dispatch(throttleToggleAction());
            break;
        }

    });


}

const visibleApp = connect(
    () => ({}),
    (dispatch) => (mapIPCToDispatch(dispatch), {})
)(Application);

export default visibleApp;