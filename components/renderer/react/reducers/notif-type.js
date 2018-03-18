"use strict";

export default (state=0, action) => {
    switch(action.type){
        case "NOTIF_ERROR":
        return 1;
        
        case "START_RUNNING":
        case "NOTIF_WARNING":
        return 0;
        
        case "NOTIF_SUCCESS":
        return 2;
        
        default:
        return state;
    }
}