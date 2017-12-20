'use strict';

import React from 'react';

class Post extends React.PureComponent {

  constructor(props){
    super(props);
  }

  onClick = () => {
    this.props.onClick(this.props, this.props.index);
  }

  getPostClass = () => {
    let base = "post";
    if (this.props.isClicked) base += " clicked";
    return base;
  }

  getImage = () => {
    return this.props.images.length > 0 ?
        <img
          src={this.props.images[0].downsizeResolution()}
          onLoad={this.props.onLoad}
          className='post-image'
        />
    :
        <img
          src={`public/img/${this.props.type}_default.png`}
          onLoad={this.props.onLoad}
          className='post-image'
        />
    ;
  }

  getStamp = () => {
    if (this.props.images.length > 1)
      return <div className='photoset-stamp'>{this.props.images.length} images</div>;
  }

  getTitle = () => {
    if (this.props.headline) {
      let doesStampExist = this.props.images.length > 0 ? true : false;
      return this.props.headline.headlineShorten(doesStampExist).capitalizeEach();
    } else {
      return `${this.props.type} Post`.capitalizeEach();
    }
  }

  getDate = () => {
    return this.props.datePublished ? this.props.datePublished.dateShorten() : "No Date";
  }

  getBody = () => {
    if (this.props.articleBody)
      return this.props.articleBody;
  }

  render(){
    return(
      <div className={this.getPostClass()} onClick={this.onClick}>
       <div className='image-wrapper'>
        <div className='hide-overflow vertical-center-contents'>
           {this.getImage()}
        </div>
       </div>
       <div className='post-content'>
         <div className='post-headline'>
           {this.getStamp()}
           <h1 className='post-title'>
           {this.getTitle()}
          </h1>
           <h1 className='post-date'>
            {this.getDate()}
           </h1>
         </div>
         <p className='post-body'>
         {this.getBody()}
         </p>
       </div>
     </div>
    )
  }
}

export default Post;
