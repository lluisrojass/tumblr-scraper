"use strict";

import {connect} from "react-redux";
import Viewer from "../presentational/viewer";
import {imageLoadedAction} from "../actions/index";

const {ipcRenderer} = electronRequire("electron");
const ipcTypes = require("../../../shared/ipctypes.json");

let mapStateToProps = (state) => {
    let clickedPost = state.clickedPost === -1  ? 
        null 
    : 
        state.posts[state.clickedPost];

    return {
        isViewing:state.clickedPost !== -1,
        post:clickedPost || {},
        imagesLoaded: clickedPost === null ? 
            true 
        : 
            clickedPost.images.length === state.loadCount
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onImageLoad: () => imageLoadedAction(),
        openInBrowser: (url) => {
            ipcRenderer.send(
                "asynchronous-message", 
                ipcTypes.OPEN_IN_BROWSER, 
                { url: url }
            );
        }
    }
}

let VisibleViewer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Viewer);

export default VisibleViewer;