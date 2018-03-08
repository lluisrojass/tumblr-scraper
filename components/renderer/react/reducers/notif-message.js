"use strict";

let notifMessage = (state="", action) => {
    switch(action.type){
        case "PARSE_COMPLETED":
        case "START_RUNNING":
            return "";    
        case "NOTIF_SUCCESS":
        case "NOTIF_WARNING":
        case "NOTIF_ERROR":
            return action.message;
        default:
            return state;
    }
}

export default notifMessage;