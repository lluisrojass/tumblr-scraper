'use strict';

const { ArchiveParser } = require('./parser');
const Loop = require('./loop');
const ee = require('events');
const pipeEvents = require('pipe-event');

module.exports = class Archive extends ee {
  go(blogName, mediaTypes){

    const parser = new ArchiveParser(mediaTypes);
    const loop = new Loop();

    parser.on('nextPage',(path) => loop.addPath(path));

    loop.on('data',(chunk) => parser.write(chunk));

    loop.on('end',() => parser.end());

    pipeEvents(['nextPage','post','date'],parser,this);
    pipeEvents(['abort','requestError','end','responseError'],loop,this);

    loop.go(blogName);
  }
}
