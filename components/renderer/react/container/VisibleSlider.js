"use strict";


import React from "react";
import Slider from "../presentational/Slider";
const {connect} = require("react-redux");

let mapStateToProps = (state) => {

}

let mapDispatchToProps = (dispatch) => {
  return {
    onToggle: id => {

    }
  }
}

let VisibleSlider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Slider);
