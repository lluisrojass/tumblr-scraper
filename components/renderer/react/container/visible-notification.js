"use strict";

// requires
const {ipcRenderer} = electronRequire("electron");
// imports
import {connect} from "react-redux";
import Notification from "../presentational/notification";

const mapStateToProps = (state) => ({ message: state.notifMessage, type: state.notifType });
const VisibleNotification = connect(mapStateToProps, () => ({}))(Notification);

export default VisibleNotification;