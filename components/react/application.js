'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { CustomForm } from './customForm';
import { Analytics } from './analytics';

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
    console.log(types);
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

  onPostClick = (data) => {
    console.warn('Terminal','Post Clicked');
    this.state.currentPost = {
      /*TODO: implement current post viewer*/
    };
    this.setState(this.state);
  }

  stopRunning = () => { this.archive.stop() }

  componentDidMount(){
    this.archive.on('nextPage',(path) => {    });

    this.archive.on('post',(postData) => {
      post(postData,(err,data) => {
        if (err !== null){
          console.warn('Terminal','Error fetching Post Data');
          // TODO: handle error
          return;
        }

        let {datePublished='No Date', articleBody='', headline=`${data.type} post`.capitalizeEach(),
        image=[], url=''} = data.postData;

        const s = document.getElementById('middle-panel');
        const isBottom = s.scrollTop+1 >= s.scrollHeight - s.clientHeight;

        this.state.scrapedData.push({
          type:'post',
          mediaType: data.type,
          datePublished: datePublished,
          body: articleBody,
          headline: headline,
          images: typeof image === 'object' ? image : [image],
          url: url
        });
        this.setState(this.state);

        if (isBottom){
          s.scrollTop = s.scrollHeight - s.clientHeight;
        }
      });

    });

    this.archive.on('date',(dateString) => {

      const s = document.getElementById('middle-panel');
      const isBottom = s.scrollTop+1 >= s.scrollHeight - s.clientHeight;

      this.state.scrapedData.push({
        type:'date',
        date:dateString
      });
      this.setState(this.state);

      if (isBottom){
        s.scrollTop = s.scrollHeight - s.clientHeight;
      }
    });

    //TODO: implement errors and end

    this.archive.on('abort',() => {
      console.log('Terminal','Aborted Requests and Parser');
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
