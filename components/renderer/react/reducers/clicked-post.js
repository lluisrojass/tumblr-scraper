"use strict";
export default (state=-1, action) => {
    switch(action.type) {
        case "CLICK_POST":
        return action.index;

        case "START_RUNNING":
        case "UNCLICK_POST":
        return -1;
        
        default:
        return state;
    }
}
