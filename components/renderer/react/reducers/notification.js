"use strict";

let notification = (state="", action) => {
  switch(action.type){
    case "NOTIF_SUCCESS":
    case "NOTIF_ERROR":
    case "NOTIF_WARNING":
      return action.message
    default:
      return state;
  }
}

export default notification;
