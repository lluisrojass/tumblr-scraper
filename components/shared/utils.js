"use strict";

let numberArrayEquals = (arr1, arr2) => {
  if (arr1 == null || arr2 == null)
    return false;
  if (arr1.length !== arr2.length)
    return false;
  for (var i = 0 ; i < arr1.length ; ++i) {
    if (!arr1.hasOwnProperty(i))
      return false;
    if (arr1[i] !== arr2[i])
      return false;
    if (typeof arr1[i] !== "number")
      return false;
  }
  return true;
}

module.exports = {
  numberArrayEquals
}
