const toFormattedDate = stamp => (
  new Date(stamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  ));

module.exports = {
  toFormattedDate
};