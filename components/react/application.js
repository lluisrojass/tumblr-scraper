'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { CustomForm } from './customForm';
import { Analytics } from './analytics';

const archive = require('../archive');
const post = require('../post');

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

  onSubmit = (event) => {
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
    if(exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
      this.archive.go(blogname,tumblrTypes);
    }
    // submit and start the loop.
    event.preventDefault();
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

          {
            this.state.scrapedData.map((value) => {
              return value.type === 'date' ?
                <Date dateString={value.date}>
                :
                <Post images={value.images} headline={value.headline}
                body={value.body} publishDate={value.date} url={value.url} onPostClick={this.postClick}/>
              ;
            });
          }

        </div>
      </div>

      <div id='right-panel-wrapper'>

      </div>

    </div>
    )
  }
}

String.prototype.headlineShorten = function(){

}
String.prototype.bodyShorten = function(){

}
String.prototype.headlineShorten = function(){

}
String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}


function Post(props){
  return(
    <div className='post'>
     <div className='image-wrapper'>
       <img src='public/img/quote_default.png' className='post-image' />
     </div>
     <div className='post-content'>
       <div className='post-headline'>
         <h1 className='post-title'>Hello Arigato Mr R...</h1>
         <h1 className='post-date'>2016-12-29</h1>
       </div>
       <p className='post-body'>Lorem Ipsum is simply dummy text of the printing and
       typesetting industry. Lorem Ipsum has been the industry's standard dummy text
       ever Lorem Ipsum has been the industry's standard dummy text ever
       </p>
     </div>
   </div>
  )
}

function Date(props){
  return(
    <div className='date-wrapper'>
      <h1>props.dateString</h1>
    </div>
  );
}


ReactDOM.render(<Application />,document.getElementById('app-container'));
