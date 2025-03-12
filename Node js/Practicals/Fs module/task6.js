const fs = require('fs')

// fs.rename('yash.txt','Yash.txt',(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('done')
//     }
// })
// this is done asynchronously 
try{
    fs.renameSync('yash.txt','yash/yash.txt')
    console.log('doen')}
catch(err){
    console.log(err)
}
// this is done synchronously 