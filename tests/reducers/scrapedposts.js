"use strict";

let scrapedPostsReducer = require("../../components/renderer/react/reducers/scrapedposts");
let expect = require("expect");

function testAddPost(){
   let base = [{a:1},{b:2},{c:3}];
   let expectedResult = [{a:1},{b:2},{c:3},{d:4}];

   let action = {
      type:"ADD_POST",
      post:{
        d:4
      }
   }

   expect(scrapedPostsReducer(base, action)).toEqual(expectedResult);
   console.log("(✓) Scraped Posts Addition Passed");
   return false;
}

function testClickPost(){
   let base = [{a:1},{b:2},{c:3}];
   let expectedResult = [{a:1},{b:2},{c:3, clicked:true}];

   let action = {
      type:"CLICK_POST",
      index:2
   }

   expect(scrapedPostsReducer(base, action)).toEqual(expectedResult);
   console.log("(✓) Scraped Posts Clicked Passed");
   return false;
}

function testUnclickPost(){
   let base = [{a:1},{b:2},{c:3}];
   let expectedResult = [{a:1, clicked:false},{b:2},{c:3}];

   let action = {
      type:"UNCLICK_POST",
      index:0
   }

   expect(scrapedPostsReducer(base, action)).toEqual(expectedResult);
   console.log("(✓) Scraped Posts Unclick Passed");
   return false;
}


function runTests(){
  testAddPost();
  testClickPost();
  testUnclickPost();
  console.log("(✓) All Scraped Posts Tests Passed");
}

module.exports = runTests;
