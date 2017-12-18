import { request } from "http";

"use strict";

let requestPath = (state="", action) => {
    switch(action.type) {
        case "START_RUNNING":
            return "";
        case "NEW_PATH":
            return action.path;
        default:
            return state;
    }
}

export default requestPath;