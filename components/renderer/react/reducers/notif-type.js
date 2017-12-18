"use strict";

let notifType = (state=0, action){
    switch(action.type){
        case "NOTIF_NEW_ERROR_MESSAGE":
            return 1;
        case "NOTIF_BLANK_MESSAGE":
        case "NOTIF_NEW_WARN_MESSAGE":
            return 0;
        case "NOTIF_NEW_SUCCESS_MESSAGE":
            return 2;
        default:
            return state;
    }
}

export default notifType;