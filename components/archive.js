'use strict';

const ArchiveParser = require('./parser').ArchiveParser;
const Loop = require('./loop');

const ee = require('events');
const pipeEvents = require('pipe-event');

class Archive extends ee {
  constructor(){ super() }
  go(blogName,mediaTypes){

    const parser = new ArchiveParser(mediaTypes);
    const loop = new Loop(parser);

    parser.on('nextPage',(path) =>{
      loop.addPath(path);
    });

    pipeEvents(['nextPage','post','date'],parser,this);
    pipeEvents(['abort','requestError','end','responseError'],loop,this);

    loop.go(blogName);
  }
}

module.exports = Archive;
