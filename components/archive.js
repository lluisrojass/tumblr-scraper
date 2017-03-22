'use strict';

const { ArchiveParser } = require('./parser');
const Loop = require('./loop');
const ee = require('events');
const pipeEvents = require('pipe-event');

module.exports = class Archive extends ee {
  constructor(){
    super();
    this.parser = null;
    this.loop = new Loop()
                .on('data', chunk => this.parser.write(chunk))
                .on('end',() => this.parser.end());

    pipeEvents(['abort','requestError','responseError','end'], this.loop,this);
  }

  go(blogName, mediaTypes){
    this.parser = new ArchiveParser(mediaTypes)
                      .on('nextPage', path => this.loop.addPath(path))
                      .on('post', () => this.loop.stress());

    pipeEvents(['nextPage','post','date'], this.parser, this);
    this.loop.go(blogName);
  }

  stop(){
    this.loop.stop();
    if (this.parser) this.parser.end();
  }

  continue() { this.loop.continue(); }
}
