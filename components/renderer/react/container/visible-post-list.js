"use strict";
// imports
import {connect} from "react-redux";
import PostList from "../presentational/post-list";
import {postUnclickAction, postClickedAction} from "../actions/index";
// requires
const {ipcRenderer} = electronRequire("electron");

const mapStateToProps = state => ({ posts: state.scrapedPosts, clickedPostIndex: state.clickedPost }); 

const mapDispatchToProps = dispatch => ({
    handlePostClick: (index, clickedPostIndex) => {
        if (clickedPostIndex !== -1)
            dispatch(postUnclickAction(clickedPostIndex));
        dispatch(postClickedAction(index));
    },
    onLoad: () => ipcRenderer.send("asynchronous-message", "IMAGE_LOADED")
});

const VisiblePostList = connect(mapStateToProps, mapDispatchToProps)(PostList);

export default VisiblePostList;