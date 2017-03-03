'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { CustomForm } from './customForm';
import { Analytics } from './analytics';

const archive = require('../archive');
const post = require('../post');
const $ = require('jquery');

String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}
String.prototype.bodyShorten = function(){
  return (this.length > 196) ? this.substr(0,193) + '...' : this.toString();
}
String.prototype.headlineShorten = function(){
  return (this.length >= 20) ? this.substr(0,18) + '...' : this.toString();
}

function exactMatch(r,str){
  const match = str.match(r);
  return match != null && str == match[0];
}

class Application extends React.Component {

  constructor(props){
    super(props);
    this.archive = new archive();
    this.state = {
      scrapedData:[],
      currentPost:{
        date:'',
        media:[],
        headline:'',
        articleBody:'',
      }
      //TODO: implement analytics
    }
  }

  start = (blogname,types) => {
    console.log(types);
    if (types.length == 0){
      console.log('Terminal: ','no types selected');
      return;
    }
    if (exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
      this.archive.go(blogname,types);
    } else {
      console.log('Terminal',blogname+' is invalid Blogname');
    }
  }

  onPostClick = (data) => {
    console.log('Terminal','Post Clicked');
    this.state.currentPost = {
      /*TODO: implement current post viewer*/
    };
    this.setState(this.state);
  }

  stopRunning = () => { this.archive.end() }

  componentDidMount(){
    // adding all event handlers
    this.archive.on('nextPage',(path) => {
      //this.state.analytics.lastRequest = path;
      //this.setState(this.state);
    });

    this.archive.on('post',(postData) => {
      post(postData,(err,data) => {
        if (err !== null){
          // TODO: handle error
          return;
        }

        let {datePublished, articleBody, headline, image, url} = data.postData;

        this.state.scrapedData.push({
          type:'post',
          // post content
          mediaType: data.type,
          datePublished: datePublished ? datePublished : 'No Date',
          body: articleBody ? articleBody : 'N/A' ,
          headline: headline ? headline : `${data.type} post`.capitalizeEach(),
          images: image ? typeof image === 'object' ? image : [image] : [],
          url: url ? url : ''
        });

        this.setState(this.state);
      });
    });

    this.archive.on('date',(dateString) => {
      this.state.scrapedData.push({
        type:'date',
        date:dateString
      });
      this.setState(this.state);
    });

    //TODO: implement errors and end

    this.archive.on('requestError',(url) => {  });
    this.archive.on('responseError',(url) => { });
    this.archive.on('end',(url) => { });

  }

  render(){
    return(
      <div id='wrapper'>

        <div id='left-panel-wrapper'>
         <div id='left-panel'>
           <div id='title-wrapper'>
             <h1 className='vertical-center-contents'>Config</h1>
           </div>
           <div id='config-wrapper'>
             <CustomForm onSubmit={this.start} />
           </div>
           <Analytics />
         </div>
       </div>

       <div id='mid-panel-wrapper'>
         <div id='middle-panel' className='scroll-box'>
          {this.state.scrapedData.map((scrapedItem,index) => {
              return scrapedItem.type === 'date' ?
                <Date key={index} date={scrapedItem.date} />
                :
                <Post key={index} {...scrapedItem} />
            })
          }
        </div>
      </div>

      <div id='right-panel-wrapper'>
          <a onClick={this.stopRunning}>stopRunning</a>
      </div>

    </div>
    )
  }
}

function Post(props){
  return(
    <div className='post'>
     <div className='image-wrapper'>
       {
         props.images.length > 0 ?
          <img src={props.images[0]} className='post-image' />
         :
          <img src={`public/img/${props.mediaType}_default.png`} className='post-image' />
       }
     </div>
     <div className='post-content'>
       <div className='post-headline'>
         <h1 className='post-title'>{props.headline.headlineShorten()}</h1>
         <h1 className='post-date'>{props.datePublished.dateShorten()}</h1>
       </div>
       <p className='post-body'>{props.body.bodyShorten()}</p>
     </div>
   </div>
  )
}

function Date(props){
  return(
    <div className='date-wrapper'>
      <h1>{props.date}</h1>
    </div>
  );
}


ReactDOM.render(<Application />,document.getElementById('app-container'));
