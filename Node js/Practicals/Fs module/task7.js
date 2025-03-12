const fs = require('fs')
try{
    fs.renameSync('yash/yash.txt','yash.txt')
    console.log('done')
}
catch(err){
    console.log(err)
}