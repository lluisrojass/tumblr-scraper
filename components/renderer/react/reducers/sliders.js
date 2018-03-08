"use strict";

let baseSliderState = [
  { name:"all", value:true },
  { name:"photo", value:false },
  { name:"chat", value:false },
  { name:"ask", value:false },
  { name:"video", value:false },
  { name:"text", value:false },
];

let sliders = (state=baseSliderState, action) => {
  switch(action.type){
    case "SLIDER_TOGGLE":
      let index = action.id;

      if (index !== 0 && state[0].value === true && state[index].value === false) 
        state = [{ name: "all", value: false }, ...state.slice(1)];

      if (index === 0 && state[index].value === false)
        return baseSliderState;

      let oldObject = state[index];
      let newObject = Object.assign({}, oldObject, { value: !oldObject.value });
      return [...state.slice(0, index), newObject, ...state.slice(index+1)];

    default:
      return state;
  }
}


module.exports = sliders;
