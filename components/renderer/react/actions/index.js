"use strict";

export const sliderToggleAction = id => ({ type: "SLIDER_TOGGLE", id});
export const startRunningAction = () => ({ type: "START_RUNNING" });
export const stopRunningAction = () => ({ type: "STOP_RUNNING" });
export const resumeRunningAction = () => ({ type: "RESUME_RUNNING" });
export const onBlogNameCharAction = text => ({ type: "BLOGNAME_TEXT", text });
export const postClickedAction = index => ({ type: "CLICK_POST", index });
export const postUnclickAction = index => ({ type: "UNCLICK_POST", index });
export const errorNotifAction = message => ({ type: "NOTIF_ERROR", message });
export const warningNotifAction = message => ({ type: "NOTIF_WARNING", message });
export const successNotifAction = message => ({ type: "NOTIF_SUCCESS", message });
export const imageLoadedAction = () => ({ type: "IMAGE_LOADED" });
export const postFoundAction = (post) => ({ type: "ADD_POST", post });
export const pathDepthAction = (path) => ({ type: "NEW_PATH", path });
export const dateDepthAction = (date) => ({ type: "NEW_DATE", date });
export const parseCompleteAction= () => ({ type: "PARSE_COMPLETED" });
export const throttleToggleAction = () => ({ type: "THROTTLE_TOGGLE" });
export const throttleStartAction = (value) => ({ type: "THROTTLE_INIT", value });