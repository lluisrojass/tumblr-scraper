"use strict";

import {connect} from "react-redux";
import Slider from "../presentational/slider";
import {throttleToggleAction, throttleStartAction} from "../actions/";


const {ipcRenderer} = electronRequire("electron");

let mapStateToProps = (state) => ({
    name: state.throttleSlider.name,
    isChecked: state.throttleSlider.value,
    isPurple: state.throttleSlider.isPurple
})

let mapDispatchToProps = (dispatch) => {
    
    ipcRenderer.on("asynchronous-reply", (event, types, data) => {
        if (types === "THROTTLE_START") {
            dispatch(throttleStartAction(data));
        } else if (types === "THROTTLE_RESPONSE") {
            dispatch(throttleToggleAction());
        }
    });

    return {
        onChange: () => ipcRenderer.send("asynchronous-message", "THROTTLE_TOGGLE")
    }
}

var VisibleThrottleSlider = connect(
    mapStateToProps,
    mapDispatchToProps
)(Slider);


export default VisibleThrottleSlider;