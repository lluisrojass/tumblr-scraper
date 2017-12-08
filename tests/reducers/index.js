"use strict";

let testScrapedPostReducer = require("./scrapedposts");
let testSliderReducer = require("./sliders");


function test(){
  testScrapedPostReducer();
  testSliderReducer();
  console.log("(✓) All Reducer Tests Passed");
}

test();
