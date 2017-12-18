"use strict";

let dateDepth = (state="", action) => {
    switch(action.type) {
        case "START_RUNNING":
            return "";
        case "NEW_DATE":
            return action.text;
        default:
            return state;
    }
}

export default dateDepth;
