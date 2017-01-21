var Archive = require('./Archive');
var Downloader = require('./Downloader');

var archive = null;
var downloader = null;

// on start
// preform initial checks
archive = new Archive();
downloader = new Downloader();

downloader.on('',)

archive.on('date',() => /* use react to update date */)
archive.on('media',(data) =>{
  downloader.setMediaType(data['type']);
  downloader.download(data['link']);
});
