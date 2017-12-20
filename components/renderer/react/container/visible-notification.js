"use strict";

const {ipcRenderer} = electronRequire("electron");
import {connect} from "react-redux";
import Notification from "../presentational/notification";
import {
    errorNotifAction,
    warningNotifAction,
    successNotifAction
} from "../actions/index";

let mapStateToProps = (state) => {
    return {
        message:state.notifMessage,
        type:state.notifType
    }
}

let mapDispatchToProps = (dispatch) => {

    ipcRenderer.on("error", (event, info) => {
        let message = info.msg ? info.msg : "unknown fatal error scraping";
        message += " ";
        message += info.path ? info.path : " unknown path";
        dispatch(errorNotifAction(message));
    })
    .on("warning", (event, info) => {
        let message = info.msg ? info.msg : "unknown error scraping"
        message += " ";
        message += info.path ? info.path : " unknown path";
        dispatch(warningNotifAction(message));
    })
    .on("timeout", (event) => {
        dispatch(errorNotifAction("fatal error: request timeout"));
    })
    .on("end", (event) => {
        dispatch(successNotifAction("Parse Complete"));
    });

    return {};
}

let VisibleNotification = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);

export default VisibleNotification;