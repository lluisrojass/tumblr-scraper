'use strict';

const { ArchiveParser } = require('./parser');
const Loop = require('./loop');
const ee = require('events');
const pipeEvents = require('pipe-event');

module.exports = class Archive extends ee {
  constructor(){
    super();
    this.parser = null;
    this.loop = new Loop();
    this.loop.on('data', chunk => this.parser.write(chunk));
    this.loop.on('end',() => this.parser.end());
    this.loop.on('abort',() => console.log('inside archive.js abort emitted'))
    pipeEvents(['abort','requestError','responseError','end'],this.loop,this);
  }
  go(blogName, mediaTypes){
    this.parser = new ArchiveParser(mediaTypes);
    this.parser.on('nextPage', path => this.loop.addPath(path));
    pipeEvents(['nextPage','post','date'],this.parser,this);
    this.loop.go(blogName);
  }
  stop(){
    return this.loop.stop(); /* triggers parser end */
  }
}
