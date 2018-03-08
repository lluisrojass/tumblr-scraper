"use strict";

import React from "react";

class Slider extends React.PureComponent {

  constructor(props){
    super(props);
  }

  render(){
    const {props} = this;
    return (
      <div className='input-row'>
        <div className='vertical-center-contents'>
          <p className={`${props.isPurple ? "purple-label" : "" } typename`}>
            {props.name.capitalizeEach()}
          </p>
          <label className='switch'>
            <input
              type='checkbox'
              onChange={props.onChange} // function(e){props.handleChange(props.name,e)
              checked={props.isChecked}
              name={props.name}
            />
            <div className={`${props.isPurple ? "purple-slider" : "slider"} round`}></div>
          </label>
        </div>
      </div>
    );
  }
}

export default Slider;
