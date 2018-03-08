"use strict";

import {connect} from "react-redux";
import Footer from "../presentational/footer";

let mapStateToProps = (state) => {
    return {
        isRunning:state.isRunning,
        atStart:state.atStart,
        dateDepth:state.dateDepth,
        path:state.requestPath,
        completed:state.completed,
        numPosts:state.scrapedPosts.length
    }
}

let mapDispatchToProps = (dispatch) => {
    return {};
}

let VisibleFooter = connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer);

export default VisibleFooter;