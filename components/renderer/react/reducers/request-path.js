"use strict";
export default  (state="", action) => {
    switch(action.type) {
        case "START_RUNNING":
        return "";
        
        case "NEW_PATH":
        return action.path;
        
        default:
        return state;
    }
}
