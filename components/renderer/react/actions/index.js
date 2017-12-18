"use strict";

export const sliderToggleAction = id => ({
  type:"SLIDER_TOGGLE",
  id
});

export const startRunningAction = () => ({
  type:"START_RUNNING"
});

export const stopRunningAction = () => ({
  type:"STOP_RUNNING"
});

export const resumeRunningAction = () => ({
  type:"RESUME_RUNNING"
});

export const onBlogNameCharAction = text => ({
  type:"BLOGNAME_TEXT",
  text
});

export const postClickedAction = index => ({
  type:"CLICK_POST",
  index
});

export const postUnclickAction = index => ({
  type:"UNCLICK_POST"
});

export const errorNotifAction = message => ({
  type:"NOTIF_NEW_ERROR_MESSAGE",
  message
});

export const imageLoadedAction = () => ({
  type:"IMAGE_LOADED"
});

