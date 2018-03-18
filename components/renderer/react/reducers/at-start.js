"use strict";
export default (state=true, action) => {
    switch(action.type){
        case "NOTIF_ERROR":
        case "PARSE_COMPLETED":
        return true;

        case "START_RUNNING":
        return false;
        
        default:
        return state;
    }
}
