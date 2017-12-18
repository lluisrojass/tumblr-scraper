"use strict";

let isRunning = (state=false, action) => {
  switch(action.type) {
    case "RESUME_RUNNING":
    case "START_RUNNING":
      return true;
    case "STOP_RUNNING":
      return false;
    default:
      return state;
  }
}

export default isRunning;
