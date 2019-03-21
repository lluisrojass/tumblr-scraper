module.exports = {
  originalPostContainer: {
    tag: 'div',
    className: 'is_original'
  },
  originalPost: {
    linkTag: 'a',
    isPostURL: (href) => 
      /^https?:\/\/.*\.tumblr\.com\/post\/.*/.test(href), 
    isAdult: (href) => 
      href.indexOf('contain-adult-content') >= 0
  },
  nextPage: {
    tag: 'a',
    id: 'next_page_link'
  }
};