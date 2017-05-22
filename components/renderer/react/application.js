'use strict';

require('../../shared/stringutils');
const ipcTypes = require('../../shared/ipctypes.json');
const {ipcRenderer} = electronRequire('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import {Config} from './config';
import {Notification} from './notification';
import {Post}  from './post';
import Viewer from './viewer';
import Footer from './footer';


class Application extends React.Component {
  constructor(props) {
    super(props);
    this.parseComplete = false;
    this.postsRendered = 0;
    this.state = {
      currentPost:null,
      atStart:true,
      isRunning:false,
      isViewing:false,
      scrapedPosts:[],
      notification:{
        msg: 'Due to the large quantity of HTTP requests, users could experience high CPU %.',
        type: 0 /* 0 = warning, 1 = error, 2 = success */
      },
      footer:{
        dateDepth:null,
        requestDepth:null
      }
    }
  }

  componentDidMount(){
    ipcRenderer.on('post', (event, post) => {
      let {scrapedPosts} = this.state;
      const m = document.getElementById('keep-bottom');
      const keepBottom = m.scrollTop+1 >= m.scrollHeight - m.clientHeight;
      post.isClicked = false;
      scrapedPosts.push(post);
      this.setState({ scrapedPosts: scrapedPosts });
      if (keepBottom) m.scrollTop = m.scrollHeight - m.clientHeight;
    })
    .on('page', (event, data) => {
      const f = this.state.footer;
      f.requestDepth = data.path;
      this.setState({ footer: f });
    })
    .on('date', (event, data) => {
      const f = this.state.footer;
      f.dateDepth = data.date;
      this.setState({ footer: f });
    })
    .on('stopped', (event) => {
      this.setState({
        isRunning:false,
        notification:{
          msg:`Paused, ${this.state.scrapedPosts.length} posts found.`,
          type:0
        }
      })
    })
    .on('end', (event) => {
      this.parseComplete = true;
      if (this.parseComplete && this.postsRendered === this.state.scrapedPosts.length)
        this.success(`Finished Parsing (${this.state.scrapedPosts.length} Posts Found).`);
    })
    .on('error', (event, data) => this.stop(`${data.msg} (${data.host}${data.path}).`))
    .on('warning', (event, data) => this.warn(`Error: ${data.msg} requesting ${data.path}.`))
    .on('timeout', (event) => this.stop('Timeout'))

    ipcRenderer.on('asynchronous-reply', (event, types, data) => {
      switch(types) {
        case ipcTypes.START_RESP: /* start triggered */
          this.setState({
              scrapedPosts : [],
              notification:{
                msg:' ',
                type:0
              },
              isViewing: false,
              atStart:false,
              isRunning: true,
              currentPost: null,
              footer: {
                dateDepth: null,
                requestDepth: null
              }
            });
          break;
        case ipcTypes.CONT_RESP:
          const notif = data.didContinue ? 'Continued.' : 'Could not continue.';
          this.setState({
            isRunning: data.didContinue,
            notification:{
              msg:notif,
              type:0
            }
          });
          break;
      }
    });
  }

  stop(msg){
    this.setState({
      atStart:true,
      isRunning:false,
      notification:{
        msg:msg,
        type:1
      }
    })
  }
  warn(msg){
    this.setState({
      notification:{
        msg:msg,
        type:0
      }
    });
  }
  success(msg){
    this.setState({
      atStart:true,
      isRunning:false,
      notification:{
        msg:msg,
        type:2
      }
    })
  }
  continueRunning = (e) => {
    e.preventDefault();
    ipcRenderer.send('asynchronous-message', ipcTypes.CONT_REQUEST);
  }
  stopRunning = () => {
    ipcRenderer.send('asynchronous-message', ipcTypes.STOP_REQUEST);
  }
  startRunning = (blogname, types) => {
    if (!types.length){
      this.stop('No Post Types Selected.');
      return;
    }
    else if (blogname.length > 32){
      this.stop('Blog Name must be 32 characters or less.');
      return;
    }
    else if (!blogname.exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/)){
      this.stop(`Invalid Blog Name "${blogname.errorShorten()}".`);
      return;
    }
    /* reset vars */
    this.postsRendered = 0;
    this.parseComplete = false;
    // start
    ipcRenderer.send('asynchronous-message', ipcTypes.START_REQUEST, {
      blogname: blogname,
      types: types
    });

  }

  openInBrowser = url => {
    ipcRenderer.send('asynchronous-message', ipcTypes.OPEN_IN_BROWSER, {url: url});
  }

  handlePostClicked = (post, index) => {
    const {scrapedPosts} = this.state;
    if (this.state.currentPost){ /* unclick */
      let {index} = this.state.currentPost;
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
      this.success(`Finished Parsing (${this.state.scrapedPosts.length} Posts Found).`);
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
                  atStart={this.state.atStart}
                  isRunning={this.state.isRunning}
                  stopRunning={this.stopRunning}
                  continueRunning={this.continueRunning}
                />
             </div>
             <Notification
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
        {...this.state.footer}
      />
    </div>
    )
  }
}
ReactDOM.render(<Application />,document.getElementById('app-container'));
