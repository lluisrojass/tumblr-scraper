"use strict";

import {combineReducers} from "redux";

const notification = require("./notification");
const scrapedPosts = require("./scrapedposts");
const sliders = require("./sliders");

const reducer = combineReducers({
  notification,
  scrapedPosts,
  sliders
});

module.exports = reducer;
