const Archive = require('./components/archive');
const getPostData = require('./components/post').get;

var archive = new Archive();

archive.on('date',(date) => {
  console.log('\x1b[33m%s','New Date: ' + date,'\x1b[0m');
});
archive.on('nextPage',(path) =>{
  console.log('\x1b[36m%s','Next Archive Page: ' + path,'\x1b[0m')
});
archive.on('post',(data) =>{
  console.log('\x1b[32m%s',`Post Found (${data['type']}): ${data['host']}${data['path']}`,'\x1b[0m');
  getPostData(data['host'],data['path'],data['type'],(err,data) => {
      if (err){
        console.log(data);
        console.log('\x1b[33m%s',`${data.error.type} getting ${data.href}`,'\x1b[0m');
        return;
      }
      console.log('\x1b[31m%s',JSON.stringify(data),'\x1b[0m');
  });
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

archive.go('',['is_photo','is_chat','is_note','is_video','is_regular'])
