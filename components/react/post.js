import React from 'react';

class Post extends React.Component {
  constructor(props){
    super(props);
    this.isClicked = false;
    this.doesStampExist = props.images.length > 0 ? true : false;
  }
  onClick = () => {
    const data = JSON.parse(JSON.stringify(this.props)); /* shallow copy */
    delete data['onClick'];
    Object.keys(data).forEach((elem) => { /* remove null data */
      if (!data[elem]){
        delete data[elem];
      }
    });
    this.props.onClick(() => this.isClicked = false, data);
    this.isClicked = true;
  }
  render(){
    return(
      <div className={`post ${this.isClicked ? 'clicked': ''}`} onClick={this.onClick}>
       <div className='image-wrapper'>
        <div className='hide-overflow vertical-center-contents'>
           {
             this.props.images.length > 0 ?
               <img src={this.props.images[0].downsizeImageResolution()} className='post-image' />
             :
              <img src={`public/img/${this.props.type}_default.png`} className='post-image' />
           }
        </div>

       </div>
       <div className='post-content'>
         <div className='post-headline'>
           {this.props.images.length > 1 ?
              <div className='photoset-stamp'>{this.props.images.length} images</div>
            :
              null
           }
           <h1 className='post-title'>
           {(this.props.headline ?
              this.props.headline.headlineShorten(this.doesStampExist)
             :
              `${this.props.type} Post`).capitalizeEach()
           }
          </h1>
           <h1 className='post-date'>
            {this.props.datePublished ?
                this.props.datePublished.dateShorten()
              :
                'No Date'
            }
           </h1>
         </div>
         <p className='post-body'>
         {this.props.articleBody ?
            this.props.articleBody.bodyShorten()
           :
            ''
         }
         </p>
       </div>
     </div>
    )
  }
}

export { Post };
