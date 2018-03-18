"use strict";
export default (state="", action) => {
    switch(action.type) {
        case "START_RUNNING":
        return "";

        case "NEW_DATE":
        return action.date;
        
        default:
        return state;
    }
}
