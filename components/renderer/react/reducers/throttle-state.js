"use strict";
export default (state=false, action) => {
    switch(action.type) {
        case "THROTTLE_INIT":
        return action.value;

        case "THROTTLE_TOGGLE":
        return !state;
        
        default:
        return state;
    }
}