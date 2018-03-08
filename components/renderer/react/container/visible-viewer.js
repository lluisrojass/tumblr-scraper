"use strict";

import {connect} from "react-redux";
import Viewer from "../presentational/viewer";
import {imageLoadedAction} from "../actions/index";

const {ipcRenderer} = electronRequire("electron");

let mapStateToProps = (state) => {
    let clickedPost = state.clickedPost === -1  ? 
        null 
    : 
        state.scrapedPosts[state.clickedPost];

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
                "OPEN_IN_BROWSER", 
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