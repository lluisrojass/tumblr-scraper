import React from 'react';

class Viewer extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div id='right-panel-wrapper'>
        <div id='right-panel' className={this.props.isViewing ? '':'no-post-selected'}>
          <h1 className='viewer-header'>Title:</h1>
          <h1 className='viewer-text'>{this.state.currentPost.headline ? this.state.currentPost.headline.headlineShorten() : 'None'}</h1>
          <br/>
          <h1 className='viewer-header'>Date:</h1>
          <h1 className='viewer-text'>{this.state.currentPost.datePublished ? this.state.currentPost.datePublished :'No Date'}</h1>
          <br/>
          <h1 className='viewer-header'>Body:</h1>
          <p className='viewer-text'>{this.state.currentPost.articleBody ? this.state.currentPost.articleBody :'None'}</p>
          <br/>
          <h1 className='viewer-header'>Media:</h1><br/>
          {this.state.currentPost.images.map((imageUrl) => <img className='viewer-image' src={imageUrl} />)}
          <a href={this.state.currentPost.url}>open in browser</a>
        </div>
      </div>
    )
  }
}
