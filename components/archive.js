'use strict';

const { ArchiveParser } = require('./parser');
const Loop = require('./loop');
const ee = require('events');
const pipeEvents = require('pipe-event');

module.exports = class Archive extends ee {
  constructor(){
    super();
    this.loop = new Loop();
    this.parser = null;
  }
  go(blogName, mediaTypes){
    this.parser = new ArchiveParser(mediaTypes);
    this.parser.on('nextPage', path => this.loop.addPath(path));
    this.loop.on('data', chunk => this.parser.write(chunk));
    this.loop.on('end',() => this.parser.end());
    this.loop.on('abort', () => this.parser.end());
    pipeEvents(['nextPage','post','date'],this.parser,this);
    pipeEvents(['abort','requestError','responseError','end'],this.loop,this);
    this.loop.go(blogName);
  }
  end(){
    if (this.loop != null)
      this.loop.abort(); /*triggers parser end*/
  }
}
