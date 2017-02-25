'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { CustomForm } from './customForm';
import { Analytics } from './analytics';

const archive = require('../archive');
const post = require('../post');
const behaviour = require('../behavior');

String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}
String.prototype.bodyFormat = function(){
    return (this.length > 196) ? this.substr(0,193) + '...' : this.toString() ;
  }
String.prototype.headlineShorten = function(){
  return (this.length >= 20) ? this.substr(0,18) + '..' : this.toString() ;
}

function exactMatch(r,str){
  const match = str.match(r);
  return match != null && str == match[0];
}

class Application extends React.Component {

  constructor(props){
    super(props);
    this.archive = new archive();
    var postCount = 0;
    this.getandIncrementPostCount = function(){
      const c = postCount;
      postCount += 1;
      return c;
    };
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

  onSubmit = (event) => {
    event.preventDefault();
    const tumblrTypes = ['is_photo','is_chat','is_note','is_video','is_regular'];
    const blogname = event.target[6].value;
    if(!event.target[0].checked){
      for(var i = 1 ; i <= 5 ;i++){
        if(!event.target[i].checked){
          tumblrTypes.splice(i-1,1);
        }
      }
      // if none checked
      if(translations.length === 5){
        alert('please choose at least one post type');
      }
    }
    // validate blogname
    if (exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
      this.archive.go(blogname,tumblrTypes);
    } else {
      //TODO: warn invalid blogname
    }
    // submit and start the loop.

  }

  onPostClick = (data) => {
    this.state.currentPost = {
      /*TODO: implement current post viewer*/
    };
    this.setState(this.state);
  }

  componentDidMount(){
    // adding all event handlers
    this.archive.on('nextPage',(path) => {
      this.state.analytics.lastRequest = path;
      this.setState(this.state);
    });

    this.archive.on('post',(postData) => {
      post(postData,(err,data) => {
        if (err !== null){
          // TODO: handle error
          return;
        }

        let {datePublished, articleBody, headline, image} = data.postData;

        this.state.scrapedData.push({
          type:'post',
          // post content
          id:this.getandIncrementPostCount(),
          date: datePublished ? datePublished : 'No Date',
          body: articleBody ? articleBody : 'N/A' ,
          headline: headline ? headline : `${data.type} Post`,
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
             <CustomForm />
           </div>
           <Analytics />
         </div>
       </div>

       <div id='mid-panel-wrapper'>
         <div id='middle-panel' className='scroll-box'>
          {this.state.scrapedData.map((scrapedItem) => {
              return scrapedItem.type === 'date' ?
                <Date key = {scrapedItem.id} dateString={scrapedItem.date} />
                :
                <Post key = {scrapedItem.id} images={scrapedItem.images} headline={scrapedItem.headline} body={scrapedItem.body} publishDate={scrapedItem.date} url={scrapedItem.url} />
            })
          }
        </div>
      </div>

      <div id='right-panel-wrapper'>

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
         props.images ?
          <img src={props.images[0]} className='post-image' />
         :
          <img src={`public/img/${props.type}_default.jpg`} className='post-image' />
       }
     </div>
     <div className='post-content'>
       <div className='post-headline'>
         <h1 className='post-title'>{props.headline.headlineShorten()}</h1>
         <h1 className='post-date'>{props.date.dateFormat()}</h1>
       </div>
       <p className='post-body'>{props.body.bodyShorten()}</p>
     </div>
   </div>
  )
}

function Date(props){
  return(
    <div className='date-wrapper'>
      <h1>{props.dateString}</h1>
    </div>
  );
}


ReactDOM.render(<Application />,document.getElementById('app-container'));
