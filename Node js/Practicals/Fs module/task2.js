const fs  = require('fs')
// fs.access('yash',(err)=>{
//     if(err){console.log(err)}
//     else{console.log('true file exists')}
// }) // to check if the folder exist 

const yas=fs.existsSync('yash') // check if the folder exist synchronously 
// console.log(yas);
const check=fs.mkdirSync('yash/hello') // making the folder synchrounusly
// console.log(check) //returns undefined 

// fs.mkdir('yash',(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('folder created success')
//     }
// })// this will create the folder asynchronously



// //again making folder to delete
// fs.mkdir('temp',(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('folder created')
//     }
// })

// fs.rename('./Yash','./yash',(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('file renamed')
//     }
// }) // raname the folder 
// fs.rmdir('./temp',(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('folder is deleted')
//     }
// })// this will delete the folder 

