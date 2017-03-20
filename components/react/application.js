'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Config } from './config';
import { Notification } from './notification';
import { Post }  from './post';
import Viewer from './viewer';
import Footer from './footer';

const archive = require('../archive');
const getPostData = require('../userPost');
const { ipcRenderer } = electronRequire('electron');

//TODO: request not aborting on abort call
//TODO: request timeout not working
//TODO: allow for better notifying with return types from archive.js a

String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}
String.prototype.bodyShorten = function(){
  var CharIndex = this[19] === ' ' ? 18: 19;
  return (this.length > 196) ? this.substr(0,this.charAt(193) === ' ' ? 192 : 193) + '...' : this.toString();
}
String.prototype.headlineShorten = function(){
  return (this.length >= 26) ? this.substr(0,this.charAt(23) === ' ' ? 22: 23) + '...' : this.toString();
}
String.prototype.errorShorten = function(){
  return (this.length >= 34) ? this.substr(0,31) + '...' : this.toString();
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
    this.defaultFooter = {
      dateDepth:null,
      requestDepth:null,
      postCount:0,
    }
    this.state = {
      removeClickedPost:null,
      currentPost:null,
      defaultPosition:true,
      finalPosition:false,
      isRunning:false,
      isErrorFound:false,
      isViewing:false,
      scrapedPosts:[],
      notification:'Due to large number of requests, users could experience large CPU Activity',
      footerData:JSON.parse(JSON.stringify(this.defaultFooter))
    }

    this.archive.on('nextPage',(path) => {
      this.state.footerData.requestDepth = path;
      this.setState(this.state);
    });

    this.archive.on('post', postInfo => {
      getPostData(postInfo, (err, data) => {
        if (err !== null){
          this.setState({
            notification: `Error: ${err.msg} requesting ${err.path}`
          });
          return;
        }

        let {datePublished=null, articleBody=null, headline=null,
        image, url='',video=null} = data.postData;

        this.state.scrapedPosts.push({
          type: data.type,
          datePublished: datePublished,
          articleBody: articleBody,
          headline: headline,
          video: video,
          images: image ? image['@list'] || [image] : [],
          url: url
        });

        this.state.footerData.postCount += 1;
        this.setStateKeepScroll();
      });
    });

    this.archive.on('date',dateString => {
      this.state.footerData.dateDepth = dateString;
      this.setState(this.state);
    });

    this.archive.on('abort',() => { /* not working */
      console.log('Abort event caught inside application.js');
    });

    this.archive.on('requestError',(urlInfo) => {
      this.setState({
        notification:urlInfo.message+' ( '+urlInfo.path+' )',
        isErrorFound:true
      });
      this.stopRunning();
    });

    this.archive.on('responseError',(urlInfo) => {
      this.setState({
        notification:urlInfo.message+' ( '+urlInfo.path+' )',
        isErrorFound:true
      });
      this.stopRunning();
    });

    this.archive.on('end',() =>{
      this.setState({
        isRunning:false,
        finalPosition:true,
        notification:'Finished'
      });
    });
  }

  continueRunning = (e) => {
    e.preventDefault();
    this.setState({
      isRunning:true
    })
    this.archive.continue();
  }
  stopRunning = () => {
    this.archive.stop();
    this.setState({ isRunning:false });
  }

  startRunning = (blogname, types) => {
    if (!types.length){
      this.setState({
        notification:'No Post Types Selected',
        isErrorFound:true
      });
      return;
    }
    if (blogname.length > 32){
      this.setState({
        notification:'Blog Name must be 32 characters or less',
        isErrorFound:true
      });
      return;
    }
    if (!(exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/, blogname))){
      this.setState({
        notification:'"'+blogname.errorShorten()+'" invalid Blog Name',
        isErrorFound:true
      });
      return;
    }
    this.archive.stop();
    this.setState({ scrapedPosts : [],
                    notification:'',
                    defaultPosition:false,
                    finalPosition:false,
                    isRunning: true,
                    currentPost: null,
                    isErrorFound:false,
                    isViewing: false,
                    footerData:JSON.parse(JSON.stringify(this.defaultFooter))
                  });
    this.archive.go(blogname, types);
  }

  openInBrowser = url => {
    ipcRenderer.send('asynchronous-message',url);
  }

  handlePostClicked = (unClickCB, data) => {
    delete data['onClick'];
    Object.keys(data).forEach((elem) => { /* remove null data */
      if (!data[elem]){
        delete data[elem];
      }
    });
    if (this.state.removeClickedPost) this.state.removeClickedPost();
    this.setState({
      removeClickedPost:unClickCB,
      currentPost:data,
      isViewing:true
    });
  }



  setStateKeepScroll = () => {
    const m = document.getElementById('keep-bottom'),
    keepBottom = m.scrollTop+1 >= m.scrollHeight - m.clientHeight;
    this.setState(this.state);
    if (keepBottom) m.scrollTop = m.scrollHeight - m.clientHeight;
  }

  render(){
    return(
      <div className='height100width100' id='wrapper'>
        <div id='content'>
          <div id='left-panel-wrapper'>
           <div id='left-panel'>
             <div id='title-wrapper'>
               <h1 className='vertical-center-contents'>Config</h1>
             </div>
             <div id='config-wrapper'>
                <Config
                      startRunning={this.startRunning}
                      isRunning={this.state.isRunning}
                      stopRunning={this.stopRunning}
                      defaultPosition={this.state.defaultPosition}
                      continueRunning={this.continueRunning}
                      finalPosition={this.state.finalPosition}
                      isErrorFound={this.state.isErrorFound}
                />
             </div>
             <Notification
                          message={this.state.notification}
                          isFatal={this.state.isErrorFound}
                          isRunning={this.state.isRunning}
                          finalPosition={this.state.finalPosition}
             />
           </div>
         </div>

         <div id='mid-panel-wrapper'>
           <div id='middle-panel'>
           <div className='height100width100 scroll-box' id='keep-bottom'>
             { this.state.scrapedPosts.length > 0 ?
                this.state.scrapedPosts.map((scrapedPost, index) =>
                  <Post onClick={this.handlePostClicked}
                        key={index}
                        {...scrapedPost}
                  />)
             :
                  <div className='height100width100 notfound'></div>
             }
           </div>
          </div>
        </div>

        <div id='right-panel-wrapper'>
          {this.state.isViewing ?
              <Viewer post={this.state.currentPost}
                      openInBrowser={this.openInBrowser}
              />
            :
              <div className='height100width100 notselected'></div>
          }
        </div>
    </div>
    <Footer isRunning={this.state.isRunning}
            {...this.state.footerData}
            isErrorFound={this.errorFound}
            defaultPosition={this.state.defaultPosition}
    />
  </div>)
  }
}


ReactDOM.render(<Application />,document.getElementById('app-container'));
