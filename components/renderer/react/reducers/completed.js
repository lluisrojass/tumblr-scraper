"use strict";

let completed = (state=false, action) => {
    switch(action.type){
        case "PARSE_COMPLETED":
            return true;
        case "START_RUNNING":
            return false;
        default:
            return state;
    }
}

export default completed;