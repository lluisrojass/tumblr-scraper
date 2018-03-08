"use strict";

import {connect} from "react-redux";
import PostList from "../presentational/post-list";
import {postUnclickAction, postClickedAction} from "../actions/index";

const {ipcRenderer} = electronRequire("electron");

let mapStateToProps = (state) => {
    return {
        posts:state.scrapedPosts,
        clickedPostIndex:state.clickedPost
    };
} 

let mapDispatchToProps = (dispatch) => {
    return {
        handlePostClick: (index, clickedPostIndex) => {
            if (clickedPostIndex !== -1)
                dispatch(postUnclickAction(clickedPostIndex));
            dispatch(postClickedAction(index));
        },
        onLoad: () => {
            ipcRenderer.send("asynchronous-message", "IMAGE_LOADED");
        }
    }
}

let VisiblePostList = connect(
    mapStateToProps,
    mapDispatchToProps
)(PostList);

export default VisiblePostList;