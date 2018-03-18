"use strict";

// imports
import {connect} from "react-redux";
import Footer from "../presentational/footer";
// requires
const {ipcRenderer} = electronRequire("electron");

const mapStateToProps = (state) => ({
    isRunning: state.isRunning,
    atStart: state.atStart,
    dateDepth: state.dateDepth,
    path: state.requestPath,
    completed: state.completed,
    numPosts: state.scrapedPosts.length,
    isThrottle: state.throttle
});

const mapDispatchToProps = (dispatch) => ({ onThrottleChange: () => ipcRenderer.send("asynchronous-message", "THROTTLE_TOGGLE") });

const VisibleFooter = connect(mapStateToProps, mapDispatchToProps)(Footer);

export default VisibleFooter;