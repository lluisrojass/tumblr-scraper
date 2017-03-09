'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { CustomForm } from './customForm';
import { Analytics } from './analytics';
import { Post, Date } from './scrapedPostTypes';

const archive = require('../archive');
const post = require('../post');

String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}
String.prototype.bodyShorten = function(){
  return (this.length > 196) ? this.substr(0,193) + '...' : this.toString();
}
String.prototype.headlineShorten = function(){
  return (this.length >= 26) ? this.substr(0,23) + '...' : this.toString();
}
String.prototype.capitalizeEach = function(){
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function exactMatch(r,str){
  const match = str.match(r);
  return match != null && str == match[0];
}
function isBottom(){
  var s;
  return s = document.getElementById('middle-panel'), s.scrollTop+1 >= s.scrollHeight - s.clientHeight;
}
function remainBottom(){
  var s;
  return s = document.getElementById('middle-panel'), s.scrollTop = s.scrollHeight - s.clientHeight;
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

  start = (blogname, types) => {
    if (types.length == 0){
      console.warn('Terminal:','No types selected');
      return;
    }
    if (exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
      this.setState({scrapedData: []});
      this.archive.go(blogname,types);
    } else {
      console.warn('Terminal',blogname+' is invalid Blogname');
    }
  }

  onPostClick = data => {
    console.warn('Terminal','Post Clicked');
    this.state.currentPost = {
      /*TODO: implement current post viewer*/
    };
    this.setState(this.state);
  }

  stopRunning = () => {
    this.archive.stop();
  }

  componentDidMount(){
    this.archive.on('nextPage',(path) => {    });

    this.archive.on('post',postData => {
      post(postData,(err,data) => {
        if (err !== null){
          console.warn('Terminal','Error fetching Post Data');
          // TODO: handle error
          return;
        }

        let {datePublished='No Date', articleBody='', headline=`${data.type} post`.capitalizeEach(),
        image=[], url=''} = data.postData;

        this.state.scrapedData.push({
          type:'post',
          mediaType: data.type,
          datePublished: datePublished,
          articleBody: articleBody,
          headline: headline,
          images: typeof image === 'object' ? image : [image],
          url: url
        });

        let isAtBottom = isBottom();
        this.setState(this.state);
        if (isAtBottom) remainBottom();

      });

    });

    this.archive.on('date',(dateString) => {

      this.state.scrapedData.push({
        type:'date',
        date:dateString
      });

      let isAtBottom = isBottom();
      this.setState(this.state);
      if (isAtBottom) remainBottom();
    });

    //TODO: implement errors and end

    this.archive.on('abort',() => {
      console.log('Abort event caught inside application.js');
    });
    this.archive.on('requestError',(urlInfo) => { console.log('Terminal','Request Error') });
    this.archive.on('responseError',(urlInfo) => { console.log('Terminal','Response Error') });
    this.archive.on('end',() => { });
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
          })}
        </div>
      </div>

      <div id='right-panel-wrapper'>
          <a onClick={this.stopRunning}>stopRunning</a>
      </div>

    </div>
    )
  }
}


ReactDOM.render(<Application />,document.getElementById('app-container'));
