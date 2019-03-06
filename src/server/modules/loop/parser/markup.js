module.exports = {
  originalPost: {
    containerClass: 'is_original',
    linkTag: 'a',
    containerTag: 'div',
    isAdult: (href) => 
      href.indexOf('contain-adult-content') >= 0
  },
  nextPage: {
    tag: 'a',
    id: 'next_page_link'
  }
};