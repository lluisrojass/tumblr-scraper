"use strict";


let sliders = (state=[], action) => {
  switch(action.type){
    case "SLIDER_TOGGLE":
      let sliderId = action.index;
      let index = state.indexOf(sliderId);
      
      if (index === -1)
        return [...state, sliderId];
      else
        return [...state.slice(0, index), ...state.slice(index+1)];

    default:
      return state;
  }
}


module.exports = sliders;
