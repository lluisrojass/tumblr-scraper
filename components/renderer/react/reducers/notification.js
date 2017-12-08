"use strict";

let baseState = {
  message:"",
  type:0 /* 0 = warning, 1 = error, 2 = success */
}

let notification = (state=baseState, action) => {
  switch(action.type){
    case "NOTIF_WARNING":
      return {
        message:action.message,
        type:0
      };
    case "NOTIF_ERROR":
      return {
        message:action.message,
        type:1
      };
    case "NOTIF_SUCCESS":
      return {
        message:action.message,
        type:2
      };
    default:
      return state;
  }
}

module.exports = notification;
