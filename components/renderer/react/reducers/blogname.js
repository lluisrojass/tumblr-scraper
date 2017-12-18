"use strict";

let blogname = (state="", action) => {
  switch(action.type) {
    case "BLOGNAME_TEXT":
      state = action.text;
      return state;

    default:
      return state;
  }
}

export default blogname
