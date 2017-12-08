"use strict";

let sliderReducer = require("../../components/renderer/react/reducers/sliders");
let expect = require("expect");

function testAddToggle() {
  let toggleIndex = 9090;
  let base = [0, 4, 55, 90];
  let expectedResult = [0, 4, 55, 90, toggleIndex];

  let action = {
    type:"SLIDER_TOGGLE",
    index: toggleIndex
  }

  expect(sliderReducer(base, action)).toEqual(expectedResult);
  console.log("(✓) Slider Add Toggle Passed");
  return false;
}

function testRemoveToggle() {
  let toggleIndex = 55;
  let base = [0, 4, 55, 90];
  let expectedResult = [0, 4, 90];

  let action = {
    type:"SLIDER_TOGGLE",
    index: toggleIndex
  }

  expect(sliderReducer(base, action)).toEqual(expectedResult);
  console.log("(✓) Slider Remove Toggle Passed");
  return false;
}

function testDefault() {
  let base = [0, 4, 55, 90];
  let expectedResult = base.slice(0); // shallow copy

  let action = {
    type:"",
    index: 55
  }

  expect(sliderReducer(base, action)).toEqual(expectedResult);
  console.log("(✓) Slider Default Toggle Passed");
  return false;
}

function runTests(){
  testDefault();
  testAddToggle();
  testRemoveToggle();
  console.log("(✓) All Slider Tests Passed");
}

module.exports = runTests;
