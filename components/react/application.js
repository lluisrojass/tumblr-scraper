'use strict';

require('../stringUtilities');
const archive = require('../archive');
const getPostData = require('../userPost');
const { ipcRenderer } = electronRequire('electron');

import React from 'react';
import ReactDOM from 'react-dom';
import { Config } from './config';
import { Notification } from './notification';
import { Post }  from './post';
import Viewer from './viewer';
import Footer from './footer';


//TODO: request not aborting on abort call
//TODO: request timeout not working
//TODO: allow for better notifying with return types from archive.js a

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
      notification:'Due to large number of requests, users could experience high CPU Activity.',
      footerData:JSON.parse(JSON.stringify(this.defaultFooter))
    }

    this.archive.on('nextPage',(path) => {
      this.state.footerData.requestDepth = path;
      this.setState(this.state);
    });

    this.archive.on('post', postInfo => {
      getPostData(postInfo, (err, data) => {
        if (err !== null){
          console.log('post error found');
          this.setState({
            notification: `Error: ${err.msg} requesting ${err.path}.`
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

    this.archive.on('abort',() => {
      this.setState({isRunning:false,
      notification:'Request Aborted.'
    })
      console.log('abort caught');
    });

    this.archive.on('requestError',(urlInfo) => {
      this.setState({
        notification:urlInfo.message+' ('+urlInfo.host+urlInfo.path+').',
        isErrorFound:true
      });
      this.stopRunning();
    });

    this.archive.on('responseError',(urlInfo) => {
      this.setState({
        notification:urlInfo.message+' ('+urlInfo.host+urlInfo.path+').',
        isErrorFound:true
      });
      this.stopRunning();
    });

    this.archive.on('end',() =>{
      this.setState({
        isRunning:false,
        finalPosition:true,
        notification:'Finished.'
      });
    });
  }

  continueRunning = (e) => {
    e.preventDefault();
    this.setState({
      isRunning:true,
      notification:''
    })
    this.archive.continue();
  }

  stopRunning = () => {
    this.archive.stop();
    this.setState({ isRunning:false });
  }

  startRunning = (blogname, types) => {
    this.setState({finalPosition:false});
    if (!types.length){
      this.setState({
        notification:'No Post Types Selected.',
        isErrorFound:true
      });
      return;
    }
    if (blogname.length > 32){
      this.setState({
        notification:'Blog Name must be 32 characters or less.',
        isErrorFound:true
      });
      return;
    }
    if (!(exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/, blogname))){
      this.setState({
        notification:'Invalid Blog Name "'+blogname.errorShorten()+'".',
        isErrorFound:true
      });
      return;
    }
    this.archive.stop();
    this.setState({ scrapedPosts : [],
                    notification:'',
                    defaultPosition:false,
                    isRunning: true,
                    currentPost: null,
                    isErrorFound: false,
                    isViewing: false,
                    footerData:JSON.parse(JSON.stringify(this.defaultFooter))
                  });
    this.archive.go(blogname, types);
  }

  openInBrowser = url => {
    ipcRenderer.send('asynchronous-message',url);
  }

  handlePostClicked = (unClickCB, data) => {

    if (this.state.removeClickedPost) this.state.removeClickedPost();

    this.setState({
      isViewing:true,
      removeClickedPost:unClickCB,
      currentPost:data
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
                          openInBrowser={this.openInBrowser}
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
