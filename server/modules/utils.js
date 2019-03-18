const shallowMerge = (oldObj, newObj) => 
  Object.assign({}, oldObj, newObj);

module.exports = {
  shallowMerge
};