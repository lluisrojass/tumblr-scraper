"use strict";

let isRunning = (state=false, action) => {
  switch(action.type) {
    case "RESUME_RUNNING":
    case "START_RUNNING":
      return true;
    case "PARSE_COMPLETED":
    case "STOP_RUNNING":
    case "NOTIF_ERROR":
      return false;
    default:
      return state;
  }
}

export default isRunning;
