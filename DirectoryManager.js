const fs = require('fs');
const path = require('path');

console.log(path.parse(__dirname));
fs.access('/users/luisrojas',fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK,(err) =>{
  console.log(err);
} )
