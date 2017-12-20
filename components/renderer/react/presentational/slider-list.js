"use strict";

import React from "react";
import Slider from "./slider"

class SliderList extends React.PureComponent {

  constructor(props){
    super(props);
    console.log(props);
  }

  render(){
    const {props} = this;
    return (  
      props.sliders.map((slider, index) => (
        <Slider
          key={index}
          name={slider.name}
          isChecked={slider.value}
          onChange={() => props.onToggle(index)}
        />)
      )
    );
  }
}

export default SliderList;
