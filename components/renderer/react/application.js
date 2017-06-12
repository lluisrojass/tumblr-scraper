'use strict';

const ipcTypes = require('../../shared/ipctypes.json');
const {ipcRenderer} = electronRequire('electron');

import React from 'react';
import Footer from './footer';
import RightPanel from './rightpanel';
import MiddlePanel from './middlepanel';
import LeftPanel from './leftpanel';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.parseComplete = false;
    this.postsRendered = 0;
    this.state = {
      blogname:'',
      currentPost:null,
      atStart:true,
      isRunning:false,
      isViewing:false,
      scrapedPosts:[],
      notification:{
        msg: 'Due to the large quantity of HTTP requests, users could experience high CPU usage.',
        type: 0 /* 0 = warning, 1 = error, 2 = success */
      },
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
    .on('end', (event) => {
      this.parseComplete = true;
      if (this.parseComplete && this.postsRendered == this.state.scrapedPosts.length)
        this.success(`Finished Parsing (${this.state.scrapedPosts.length} Posts Found).`);
    })
    .on('error', (event, data) => this.error(`${data.msg} (${data.host}${data.path}).`))
    .on('warning', (event, data) => this.warn(`Error: ${data.msg} requesting ${data.path}.`))
    .on('timeout', (event) => this.error('Response timeout'));

    ipcRenderer.on('asynchronous-reply', (event, types, data) => {
      switch(types) {
        case ipcTypes.START_RESP: /* loop started */
          this.setState({
            isViewing: false,
            atStart:false,
            isRunning: true,
            scrapedPosts : [],
            notification:{
              msg:' ',
              type:0
            },
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

  error(msg){ /* called when the loop has finished with an error */
    this.setState({
      atStart:true,
      isRunning:false,
      notification:{
        msg:msg,
        type:1
      }
    })
  }

  warn(msg){ /* notification utility */
    this.setState({
      notification:{
        msg:msg,
        type:0
      }
    });
  }

  success(msg){ /* notification utility */
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
    const {scrapedPosts} = this.state;
    if (this.state.currentPost){ /* unclick */
      let {index} = this.state.currentPost;

      let post = scrapedPosts[index];
      post.isClicked = false;
      scrapedPosts[index] = post;
    }
    this.setState({ isViewing: false }, () => {
      scrapedPosts[index].isClicked = true;
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
