'use strict';

const ipcTypes = require('../../shared/ipctypes.json');
const {ipcRenderer} = electronRequire('electron');
const {List} = require('immutable');

import React from 'react';
import Footer from './footer';
import RightPanel from './rightpanel';
import MiddlePanel from './middlepanel';
import LeftPanel from './leftpanel';

class Application extends React.Component {
  constructor(props) {
    super(props);
    /* non render related state */
    this.parseComplete = false;
    this.postsRendered = 0;

    this.state = {
      blogname:'',
      currentPost:null,
      atStart:true,
      isRunning:false,
      isViewing:false,
      scrapedPosts:[],
      footer:{
        dateDepth:'',
        requestDepth:null
      },
      viewerMeta:{
        loadText:'Loading Images..',
        loadCount:0
      }
    }
  }

  bindIPCHandlers = () => {

  }

  componentDidMount(){
    /* ipc handler for new post found */

    ipcRenderer.on('post', (event, post) => {
      let {scrapedPosts} = this.state;
      const m = document.getElementById('keep-bottom');
      const keepBottom = m.scrollTop+1 >= m.scrollHeight - m.clientHeight;
      post.isClicked = false;

      if (this.state.scrapedPosts.length === 0){
        scrapedPosts = List.of(post);
      } else {
        scrapedPosts = scrapedPosts.push(post);
      }

      this.setState({ scrapedPosts: scrapedPosts });
      if (keepBottom) m.scrollTop = m.scrollHeight - m.clientHeight;
    })
    /* ipc handler for new page data found */
    .on('page', (event, data) => {
      const f = this.state.footer;
      f.requestDepth = data.path;
      this.setState({ footer: f });
    })
    /* ipc handler for new date info found */
    .on('date', (event, data) => {
      const f = this.state.footer;
      f.dateDepth = data.date;
      this.setState({ footer: f });
    })


    ipcRenderer.on('asynchronous-reply', (event, types, data) => {
      switch(types) {
        case ipcTypes.START_RESP: /* loop started */
          this.setState({
            isViewing: false,
            atStart:false,
            isRunning: true,
            scrapedPosts :[],
            currentPost: null,
            footer: {
              dateDepth: null,
              requestDepth: null
            }
          });
          break;
        case ipcTypes.CONT_RESP: /* Loop continued */
          const notif = data.didContinue ? 'Continued.' : 'Could not continue.';
          this.setState({
            isRunning: data.didContinue,
            notification:{
              msg:notif,
              type:0
            }
          });
          break;
        case ipcTypes.STOP_RESP: /* loop stopped ('paused') */
          this.setState({
            isRunning:false,
            notification:{
              msg:`Paused (${this.state.scrapedPosts.length} `+
                  `${this.state.scrapedPosts.length >= 2 || this.state.scrapedPosts.length == 0 ? 'posts were' : 'post was' }`+
                  ` found from ${this.state.footer.dateDepth} to today)`,
              type:0
            }
          });
          break;
      }
    });
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
      this.error('No Post Types Selected.');
      return;
    } else if (blogname.length > 32) {
      this.error('Blog Name must be 32 characters or less.');
      return;
    } else if (!blogname.exactMatch(/[a-zA-Z0-9]+(\-*[a-zA-Z0-9])*/)) {
      this.error(`Invalid Blog Name "${blogname}".`);
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
    let {scrapedPosts} = this.state;

    if (this.state.currentPost){ /* unclick */
      let {index} = this.state.currentPost;
      let post = scrapedPosts.get(index);
      post = post.set(isClicked, false);
      scrapedPosts = scrapedPosts.set(index, post);
    }

    this.setState({ isViewing: false }, () => {
      console.log("hey");
      let post = scrapedPosts.get(index);
      post = post.set(isClicked, true);
      this.setState({
        currentPost: post,
        scrapedPosts: scrapedPosts,
        isViewing: true,
        viewerMeta:{
          loadText:'Loading Images..',
          loadCount:0
        }
      });
    });

  }

  onLoad = () => {
    this.postsRendered++;
    if (this.parseComplete && this.postsRendered === this.state.scrapedPosts.length)
      this.success(
        `Finished Parsing (${this.state.scrapedPosts.length} `+
          `${this.state.scrapedPosts.length > 1 || this.state.scrapedPosts.length == 0 ? 'Posts' : 'Post' }`+
          ` found from ${this.state.footer.dateDepth} to today).`

    );
  }

  onLoadViewer = () => {
    const {viewerMeta, currentPost} = this.state;
    viewerMeta.loadCount++;
    if (viewerMeta.loadCount === currentPost.images.length){
      viewerMeta.loadText = '';
    }
    this.setState({
      viewerMeta:viewerMeta
    });
  }

  render(){
    return(
      <div className='height100width100' id='wrapper'>
        <div id='content'>
          <LeftPanel
            startRunning={this.startRunning}
            atStart={this.state.atStart}
            isRunning={this.state.isRunning}
            stopRunning={this.stopRunning}
            continueRunning={this.continueRunning}
            notification={this.state.notification}
            getDateDepth={() => this.state.footer.dateDepth}
            getPostLength={() => this.state.scrapedPosts.size}
          />
          <MiddlePanel
            scrapedPosts={this.state.scrapedPosts}
            handlePostClicked={this.handlePostClicked}
            isClicked={this.state.isClicked}
            onLoad={this.onLoad}
          />
          <RightPanel
            currentPost={this.state.currentPost}
            openInBrowser={this.openInBrowser}
            isViewing={this.state.isViewing}
            viewerMeta={this.state.viewerMeta}
            onLoadViewer={this.onLoadViewer}
          />
      </div>
      <Footer
        isRunning={this.state.isRunning}
        {...this.state.footer}
      />
    </div>
    )
  }
}

export default Application;
