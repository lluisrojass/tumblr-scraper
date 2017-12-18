"use strict";

import {connect} from "react-redux";
import Notification from "../presentational/notification";


let mapStateToProps = (state) => {
    return {
        message:state.notifMessage,
        type:state.notifType
    }
}

let mapDispatchToProps = () => {

}

let VisibleNotification = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);

export default VisibleNotification;