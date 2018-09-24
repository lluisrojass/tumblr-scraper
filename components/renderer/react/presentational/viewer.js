import React from 'react';

class Viewer extends React.PureComponent {
  constructor(props){
    super(props);
  }

  headline = () => {
    const {headline} = this.props.post;
    if (!headline) 
      return "";
    else 
      return (
        <h1 className='viewer-title'>
          {headline}
        </h1>
      );
  }

  date = () => {
    const {datePublished} = this.props.post;
    if (!datePublished)
      return "";
    else 
      return (
        <h1 className='viewer-date'>
          {Date.parse(datePublished).toString()}
        </h1>
      )
  }
  
  video = () => {
    const {isVideo, videoURL} = this.props.post;
    if (!isVideo) 
      return "";
    else if (!videoURL) 
      return (<p>Video Preview Unavailable</p>);
    else 
      return (
        <div id='video-wrapper'>
          <iframe frameBorder='0' src={videoURL} />
        </div>
      );
  }

  url = () => {
    const {props} = this;
    const {url} = props.post;

    if (!url)
      return "";
    
    else
      return (
        <div id='viewer-url-wrapper'>
          <a href='#' rel="noopener" onClick={() => props.openInBrowser(url)} className='viewer-url'>
            Open in Browser
          </a>
        </div>
      );
  }

  images = () => {
    const {props} = this;
    const {images} = props.post;
    if (images == null || images.length === 0) 
      return "";
    else 
      return (
        <div id='viewer-image-wrapper'>
          {images.map((url, index) =>
            <img  
              key={index}
              src={url} 
              className="viewer-image"
              onLoad={props.onImageLoad} 
            />)
          }
        </div>
      );
  }

  article = () => {
    const {articleBody} = this.props.post;
    if (!articleBody)
      return "";
    else 
      return (
        <p className='viewer-body'>
          {articleBody}
        </p>
      );
  }

  loadPreview = () => {
    const {imagesLoaded, isViewing} = this.props;
    if (imagesLoaded || !isViewing) return "";
    else 
      return (
        <p id='load-text'>loading images...</p>
      );
  }

  render(){
    if (!this.props.isViewing) 
      return (
        <div className='height100width100 notselected'> </div>
      );
    
    return (
      <div id='right-panel' className='height100width100'>
        {this.headline()}
        {this.date()}
        {this.article()}
        {this.video()}
        {this.images()}
        {this.url()}
        {this.loadPreview()}
      </div>
    );

  }
}

export default Viewer;