"use strict";

import {combineReducers} from "redux";
import notification from "./notification";
import scrapedPosts from "./scraped-posts";
import sliders from "./sliders";
import clickedPost from "./clicked-post";
import blogname from "./blogname";
import isRunning from "./is-running";
import dateDepth from "./date-depth";
import requestPath from "./request-path";
import loadCount from "./load-count";
import atStart from "./at-start";
import notifMessage from "./notif-message";
import notifType from "./notif-type";
import completed from "./completed";
import throttleSlider from "./throttle-slider";

export const reducer = combineReducers({
  notification,
  scrapedPosts,
  sliders,
  clickedPost,
  blogname,
  isRunning,
  atStart,
  requestPath,
  dateDepth,
  loadCount,
  notifMessage,
  notifType,
  completed,
  throttleSlider
});
