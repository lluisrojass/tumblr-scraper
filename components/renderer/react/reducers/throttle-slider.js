"use strict";

let baseState = {
    name: "throttle",
    isPurple: true,
    value: false
}

let throttleSlider = (state=baseState, action) => {
    switch(action.type) {

        case "THROTTLE_START":
            return Object.assign({}, baseState, { value: action.value });

        case "THROTTLE_TOGGLE":
            return Object.assign({}, baseState, { value: !state.value });

        default:
            return state;
    }
}

export default throttleSlider;