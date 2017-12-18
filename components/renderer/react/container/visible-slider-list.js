"use strict";

import React from "react";
import SliderList from "../presentational/slider";
import {sliderToggleAction} from "../actions/index";
import {connect} from "react-redux";

let mapStateToProps = (state) => {
  return {
    sliders: state.sliders
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onToggle: id => {
      dispatch(sliderToggleAction(id))
    }
  }
}

let VisibleSlider = connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderList);

export default VisibileSlider;
