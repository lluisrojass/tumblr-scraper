"use strict";
// imports
import {connect} from "react-redux";
import Viewer from "../presentational/viewer";
import {imageLoadedAction} from "../actions/index";
// requires
const {ipcRenderer} = electronRequire("electron");

const mapStateToProps = state => {
    let clickedPost = state.clickedPost === -1  ? 
        null 
    : 
        state.scrapedPosts[state.clickedPost];

    return {
        isViewing: state.clickedPost !== -1,
        post: clickedPost || {},
        imagesLoaded: clickedPost === null ? true : clickedPost.images.length === state.loadCount
    }
}

const mapDispatchToProps = (dispatch) => ({
    onImageLoad: () => dispatch(imageLoadedAction()),
    openInBrowser: (url) => (ipcRenderer.send("asynchronous-message", "OPEN_IN_BROWSER", { url: url }))
});

const VisibleViewer = connect(mapStateToProps, mapDispatchToProps)(Viewer);

export default VisibleViewer;