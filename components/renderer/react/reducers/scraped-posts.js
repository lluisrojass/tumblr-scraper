"use strict";

let scrapedPosts = (state=[], action) => {
  switch(action.type){

    case "START_RUNNING":
      return [];

    case "ADD_POST":
      return [...state, action.post];

    case "CLICK_POST":
      let clickedPost = Object.assign({}, state[action.index], { clicked: true });
      return [...state.slice(0, action.index), clickedPost, ...state.slice(action.index+1)];

    case "UNCLICK_POST":
      let unclickedPost = Object.assign({}, state[action.index], { clicked: false });
      return [...state.slice(0, action.index), unclickedPost, ...state.slice(action.index+1)];

    default:
      return state;
  }
}

export default scrapedPosts;
