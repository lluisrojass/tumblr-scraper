"use strict";
export default (state=0, action) => {
    switch(action.type) {
        case "IMAGE_LOADED":
        return state + 1;

        case "UNCLICK_POST":
        return 0;
        
        default:
        return state;
    }
} 