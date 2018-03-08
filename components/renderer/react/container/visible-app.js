"use strict";

import {connect} from "react-redux";
const {ipcRenderer} = electronRequire('electron');
import Application from "../presentational/application";
import {postFoundAction, pathDepthAction, dateDepthAction} from "../actions/index.js";

let mapStateToProps = (state) => {
    return {};
} 

let mapDispatchToProps = (dispatch) => {

    ipcRenderer.on("post", (event, post) => {
        const bottom = document.getElementById("keep-bottom");
        const keepBottom = bottom.scrollTop+1 >= bottom.scrollHeight - bottom.clientHeight;
        post.isClicked = false;
        dispatch(postFoundAction(post));
        if (keepBottom) 
            bottom.scrollTop = bottom.scrollHeight - bottom.clientHeight;   
    })
    .on("page", (event, data) => {
        dispatch(pathDepthAction(data.path));
    })
    .on("date", (event, data) => {
        dispatch(dateDepthAction(data.date));
    });
    
    return {};
}

let visibleApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(Application);

export default visibleApp;