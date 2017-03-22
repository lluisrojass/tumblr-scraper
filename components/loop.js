'use strict';

const http = require('http');
const https = require('https');
const ee = require('events');

module.exports = class RequestLoop extends ee {
  constructor() {
    super();
    const self = this;
    this.req = null;
    this.protocol = http;
    this.running = false;
    this.postCount = 0;
    this.options = {
      host:'',
      path:'',
      headers:{
        'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) ' +
                     'AppleWebKit/537.36 (KHTML, like Gecko) '+
                     'Chrome/56.0.2924.87 Safari/537.36'
      }
    };

    this.callback = function(res) {
      res.setEncoding();
      if (res.statusCode !== 200) {
        if (res.statusCode === 302) { /* Blogs without a theme require https */

          self.protocol = https;
          self.continue();

        } else {
          const m = ((c) => {
            switch(c){
              case 429:
                this.switchUserAgent()
                return 'Internal rate limit triggered, user agent switched, please re-run';
              case 404:
                return 'Invalid Blogname';
              case 301:
                return 'Blog redirects out of Tumblr, cannot scrape';
              default:
                return `Error: ${res.statusCode} Received`;
              }
          })(res.statusCode);

          self.emit('responseError', {
            'host':self.options.host,
            'path':self.options.path,
            'message':m
          });
        }
        return;
      }
      res.setTimeout(3000, () => self.req.abort());
      res.on('data', chunk => self.emit('data',chunk));
      res.on('end', () => {
        if ('' === self.options.path && self.running)
          self.emit('end');
        else if (self.running) {
          self.req = self._req();
        }
      });
    }
  }

  _req() {
    return this.protocol.get(this.options,this.callback)
            .on('error',(e) => {
              const m = ((c) => {
                switch(c){
                  case 'ENOTFOUND':
                    return 'Not able to connect to address. '+
                           'Check internet connection';
                  default:
                    return c;
                }
              })(e.code);

              this.emit('requestError',{
                'host':this.options.host,
                'path':this.options.path,
                'message':m
              });
            })
            .on('response',() => this.options.path = '')
            .on('abort',() => this.emit('abort'))
            .setTimeout(6000,() => this.req.abort());
  }
  switchUserAgent(){
    this.options.headers['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0'
  }
  go(blogname, path='/archive') {
    this.options.path = path;
    this.options.host = `${blogname}.tumblr.com`;
    this.req = this._req();
    this.running = true;
  }

  _initStressTesting() {
    setInterval(() => {
      if (this.postCount > 50 && !this.stressTimeout){

        const tsecs = 1000 * (this.postCount / 50 + 6);
        console.log(`${this.postCount} posts, timing out for ${tsecs}`);

        this.stop();
        this.stressTimeout = true;

        setTimeout(() => {
          this.continue();
          this.stressTimeout = false;
        }, tsecs);

      } else {
        console.log('passing stress testing');
        this.postCount = 0;
      }
    }, 6000);
  }

  stop()     { this.running = false  }

  addPath(p) { this.options.path = p }

  stress()   { this.postCount += 1   }

  continue() { this.go(this.options.host.match(/(\w|\-)*/)[0], this.options.path) }
}
