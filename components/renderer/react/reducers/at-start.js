"use strict";

let atStart = (state=true, action) => {
    switch(action.type){
        case "FINISH_RUNNING":
            return true;
        case "START_RUNNING":
            return false;
        default:
            return state;
    }
}

export default atStart;