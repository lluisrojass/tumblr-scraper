const Archive = require('./Archive');
const PostData = require('./PostData');

var archive = new Archive();
var postData = new PostData();

postData.on('requestError',(link)=>{
  console.log('\x1b[30m%s',`Request Error getting ${link}`,'\x1b[0m');
});

postData.on('responseError',(link)=>{
  console.log('\x1b[31m%s',`Response Error getting ${link}`,'\x1b[0m');
});

postData.on('data',(data)=>{
  console.log('\x1b[30m%s',`${JSON.stringify(data)}`,'\x1b[0m');
});

archive.on('date',(date) => {
  console.log('\x1b[33m%s','New Date: ' + date,'\x1b[0m');
});
archive.on('nextPage',(path) =>{
  console.log('\x1b[36m%s','Next Archive Page: ' + path,'\x1b[0m')
});
archive.on('post',(data) =>{
  console.log('\x1b[32m%s',`Post Found (${data['type']}): ${data['host']}${data['path']}`,'\x1b[0m');
  postData.get(data['host'],data['path'],data['type']);
});

archive.on('responseError',(link) =>{
  console.log('\x1b[31m%s',`Response Error getting ${link}`,'\x1b[0m');
});
archive.on('requestError',(link) =>{
  console.log('\x1b[31m%s',`Request Error getting ${link}`,'\x1b[0m');
})
archive.on('end',() =>{
  console.log('\x1b[30m%s',`OVER`,'\x1b[0m');
});

archive.go('xxx',['is_photo','is_note'])
