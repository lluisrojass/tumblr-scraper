"use strict";

const {ipcRenderer} = electronRequire("electron");
import {connect} from "react-redux";
import Notification from "../presentational/notification";
import {
    errorNotifAction,
    warningNotifAction,
    successNotifAction,
    parseCompleteAction
} from "../actions/index";

let mapStateToProps = (state) => {
    return {
        message:state.notifMessage,
        type:state.notifType
    }
}

let mapDispatchToProps = (dispatch) => {

    ipcRenderer.on("error", (event, info) => {
        let message = info.message ? info.message : "unknown fatal error scraping";
        message += " ";
        message += info.path ? info.path : " unknown path";
        dispatch(errorNotifAction(message));
        return false;
    })
    .on("warning", (event, info) => {
        let message = info.msg ? info.msg : "unknown error scraping"
        message += " ";
        message += info.path ? info.path : " unknown path";
        dispatch(warningNotifAction(message));
        return false;
    })
    .on("timeout", (event) => {
        dispatch(errorNotifAction("fatal error: request timeout"));
    })
    .on("end", (event) => {
        dispatch(parseCompleteAction());
    });

    return {};
}

let VisibleNotification = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);

export default VisibleNotification;