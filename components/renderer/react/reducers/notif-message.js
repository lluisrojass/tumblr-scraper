"use strict";

let notifMessage = (state="", action) => {
    switch(action.type){
        case "NOTIF_BLANK_MESSAGE":
            return "";    
        case "NOTIF_NEW_SUCCESS_MESSAGE":
        case "NOTIF_NEW_WARN_MESSAGE":
        case "NOTIF_NEW_ERROR_MESSAGE":
            return action.message;
        default:
            return state;
    }
}

export default notifMessage;