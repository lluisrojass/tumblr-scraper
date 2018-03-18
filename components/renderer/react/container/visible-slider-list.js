"use strict";

import React from "react";
import SliderList from "../presentational/slider-list";
import {sliderToggleAction} from "../actions/index";
import {connect} from "react-redux";

const mapStateToProps = (state) => ({ sliders: state.sliders });

const mapDispatchToProps = (dispatch) => ({ onToggle: id => dispatch(sliderToggleAction(id)) });

const VisibleSliderList = connect(mapStateToProps, mapDispatchToProps)(SliderList);

export default VisibleSliderList;
