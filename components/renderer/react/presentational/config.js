"use strict";

import React from "react";
import VisibleSliderList from "../container/visible-slider-list";
import Textbox from "./textbox";

class Config extends React.PureComponent {

  constructor(props){
    super(props);
    console.log(props);
  }

  getResumeButton(){
    const {props} = this;
    if (props.isRunning && !props.atStart)
      return (
        <button 
          onClick={props.continueRunning} 
          className="resume-button fbutton vertical-center-contents">
              RESUME
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
          PAUSE
        </button>
      );
    } else {
      return (
        <button 
          onClick = {(event) => props.startRunning(props.blogname, props.sliders)}
          className='go-button vertical-center-contents'>
          START
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
            <Textbox
              name='Blog Name'
              addChar={props.onText}
              blogname={props.blogname}
            />
            <div className='button-wrapper'>
              {this.getMainButton()}
              {this.getResumeButton()}
            </div>
          </form>
        </div>
      );
  }
}

export default Config;
