"use strict";
export default (state="", action) => {
  switch(action.type) {
    case "BLOGNAME_TEXT":
    return action.text;
    
    default:
    return state;
  }
}