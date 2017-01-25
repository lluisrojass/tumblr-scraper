const ArchiveParser = require('./Parser').ArchiveParser;
const Loop = require('./RequestLoop');
const ee = require('events');

class Archive extends ee {
  go(blogName,mediaTypes){
    const self = this;
    const parser = new ArchiveParser(mediaTypes);
    const loop = new Loop(parser)
    parser.addLoopRef(loop);
    loop.kickoff(blogName);
  };
}
