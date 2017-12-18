"use strict";

import {connect} from "react-redux";
import PostList from "../presentational/post-list";
import {postUnclickAction, postClickedAction} from "../actions/index";

let mapStateToProps = (state) => {
    return {
        posts:state.scrapedPosts
    };
} 

let mapDispatchToProps = (dispatch) => {
    return {
        handlePostClick: (index) => {
            dispatch(postUnclickAction());
            dispatch(postClickedAction(index));
        }
    }
}

let VisiblePostList = connect(
    mapStateToProps,
    mapDispatchToProps
)(PostList);

export default VisiblePostList;