'use strict';

require('../../shared/stringutils');
const { RR_T, A_T } = require('../../shared/ipcmessagetypes');
const { ipcRenderer } = electronRequire('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import { Config } from './config';
import { Notification } from './notification';
import { Post }  from './post';
import Viewer from './viewer';
import Footer from './footer';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.parseComplete = false;
    this.postsRendered = 0;
    this.state = {
      currentPost:null,
      defaultPosition:true,
      isRunning:false,
      isViewing:false,
      scrapedPosts:[],
      notification:{
        msg: 'Due to large number of requests, users could experience high CPU Activity.',
        type: 0 /* 0 = warning, 1 = error, 2 = success */
      },
      footer:{
        dateDepth:null,
        requestDepth:null,
        postCount:0
      }
    }
  }

  componentDidMount = function(){
    ipcRenderer.on('post', (event, data) => {
      let { scrapedPosts } = this.state;
      const m = document.getElementById('keep-bottom');
      const keepBottom = m.scrollTop+1 >= m.scrollHeight - m.clientHeight;
      scrapedPosts.push(data.post);
      this.setState({ scrapedPosts: scrapedPosts });
      if (keepBottom) m.scrollTop = m.scrollHeight - m.clientHeight;
    })
    .on('page', (event, data) => {
      const f = this.state.footer;
      f.requestDepth = data.path;
      this.setState({ footer: f });
    })
    .on('date', (event, data) => {
      data.toString().debug();
      const f = this.state.footer;
      f.dateDepth = data.date;
      this.setState({ footer: f });
    })
    .on('error', (event, data) => {
      this.notifyStopRun(`${data.message} (${data.host}${data.path}).`);
    })
    .on('stopped', (event) => {
      this.notifyStopRun('Stopped.', 0);
    })
    .on('end', (event) => {
      this.parseComplete = true;
      `parse complete with ${this.postsRendered} posts rendered`.debug();

    })
    .on('warning', (event, data) => {
      this._notifyWarning(`Error: ${data.msg} requesting ${data.path}.`);
    })
    .on('timeout', (event) => {
      this.notifyStopRun('Timeout.');
    })

    ipcRenderer.on('asynchronous-reply', (event, types, data) => {
      switch(types) {
        case RR_T.START_RESPONSE: /* start triggered */
          this.setState({
              scrapedPosts : [],
              notification: '',
              isViewing: false,
              defaultPosition: false,
              isRunning: true,
              currentPost: null,
              footer: {
                dateDepth: null,
                requestDepth: null
              }
            });
          break;
        case RR_T.CONTINUE_RESPONSE:
          const notif = data.didContinue ? 'Continued.' : 'Could not Continue.';
          this.setState({
            isRunning: data.didContinue,
            notification: notif
          });
          break;
      }
    });
  }

  notifyStopRun = (msg, type=1) => {
    switch(type) {
      case 0:
        this._notifyWarning(msg);
        break;
      case 1:
        this._notifyError(msg);
        break;
      case 2:
        this._notifySuccess(msg);
        break;
    }
    this.setState({ isRunning: false });
  }

  _notifyWarning = (msg) => {
    this.setState({
      notification:{
        msg:msg,
        type:0
      }
    })
  }

  _notifyError = (msg) => {
    this.setState({
      notification:{
        msg:msg,
        type:1
      }
    })
  }

  _notifySuccess = (msg) => {
    this.setState({
      notification:{
        msg:msg,
        type:2
      }
    })
  }

  continueRunning = (e) => {
    e.preventDefault();
    ipcRenderer.send('asynchronous-message', RR_T.CONTINUE_REQUEST);
  }
  stopRunning = () => {
    ipcRenderer.send('asynchronous-message', RR_T.STOP_REQUEST);
  }
  startRunning = (blogname, types) => {
    if (!types.length)
      return this.notifyStopRun('No Post Types Selected.');
    else if (blogname.length > 32)
      return this.notifyStopRun('Blog Name must be 32 characters or less.');
    else if (!blogname.exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/))
      return this.notifyStopRun('Invalid Blog Name "'+blogname.errorShorten()+'".');
    /* reset vars */
    this.postsRendered = 0;
    this.parseComplete = false;
    // start
    ipcRenderer.send('asynchronous-message', RR_T.START_REQUEST ,{
      blogname: blogname,
      types: types
    });

  }
  openInBrowser = url => {
    ipcRenderer.send('asynchronous-message', RR_T.OPEN_IN_BROWSER, {url: url});
  }

  handlePostClicked = (post, index) => {
    const { scrapedPosts } = this.state;
    if (this.state.currentPost){ /* unclick */
      let { index } = this.state.currentPost;
      let post = scrapedPosts[index];
      post.isClicked = false;
      scrapedPosts[index] = post;
    }
    scrapedPosts[index].isClicked = true;
    this.setState({
      currentPost: post,
      scrapedPosts: scrapedPosts,
      isViewing: true
    });
  }
  onLoad = () => {
    this.postsRendered++;
    if (this.parseComplete && this.postsRendered === this.state.scrapedPosts.length)
      this.notifyStopRun('Finished.', 2);
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
                  continueRunning={this.continueRunning}
                />
             </div>
             <Notification
               openInBrowser={this.openInBrowser}
               {...this.state.notification}
             />
           </div>
         </div>
         <div id='mid-panel-wrapper'>
           <div id='middle-panel'>
             <div className='height100width100 scroll-box' id='keep-bottom'>
               {this.state.scrapedPosts.length > 0 ?
                  this.state.scrapedPosts.map((scrapedPost, index) =>
                    <Post
                      onClick={this.handlePostClicked}
                      isClicked={this.state.isClicked}
                      key={index}
                      index={index}
                      {...scrapedPost}
                      onLoad={this.onLoad}
                    />)
                  :
                    <div className='height100width100 notfound'></div>
               }
             </div>
           </div>
         </div>
         <div id='right-panel-wrapper'>
           <Viewer
             post={this.state.currentPost}
             openInBrowser={this.openInBrowser}
             isViewing={this.state.isViewing}
           />
        </div>
      </div>
      <Footer
        isRunning={this.state.isRunning}
        postCount={this.state.scrapedPosts.length}
        {...this.state.footer}
      />
    </div>
    )
  }
}
ReactDOM.render(<Application />,document.getElementById('app-container'));
