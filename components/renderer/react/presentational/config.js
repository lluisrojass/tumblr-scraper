"use strict";

import React from "react";
import VisibleSliderList from "../container/visible-slider-list";
import VisibleNotification from "../container/visible-notification";
import Textbox from "./textbox";
import VisibleThrottleSlider from "../container/visible-throttle-slider";

class Config extends React.PureComponent {

  constructor(props){
    super(props);
  }

  getResumeButton(){
    const {props} = this;
    if (!props.isRunning && !props.atStart)
      return (
        <button 
          onClick={props.resumeRunning} 
          className="resume-button fbutton vertical-center-contents">
              Resume
        </button>
      )
  }

  getMainButton(){
    const {props} = this;
    if (props.isRunning){
      return (
        <button 
          className='stop-button vertical-center-contents'
          onClick = {props.stopRunning} >
          Pause
        </button>
      );
    } else {
      return (
        <button 
          onClick = {(event) => props.startRunning(props.blogname, props.sliders)}
          className='go-button vertical-center-contents'>
          Start
        </button>
      );
    }
  }

  render() {
    const {props} = this;
    return (
      <div className='height100width100' id='form-wrapper'>
        <form id='customform' action='' onSubmit={(e) => {e.preventDefault()}}>
            
            <VisibleSliderList />
            <VisibleThrottleSlider />
            <Textbox
              name='Blog Name'
              onChange={props.onText}
              blogname={props.blogname}
            />
            <div className='button-wrapper'>
              {this.getMainButton()}
              {this.getResumeButton()}
            </div>
          </form>
          <VisibleNotification />
          
        </div>
      );
  }
}

export default Config;
