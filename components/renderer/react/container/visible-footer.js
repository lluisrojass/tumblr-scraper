"use strict";

import {connect} from "react-redux";
import Footer from "../presentational/footer";

let mapStateToProps = (state) => {
    return {
        isRunning:state.isRunning,
        dateDepth:state.dateDepth,
        path:state.requestPath
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