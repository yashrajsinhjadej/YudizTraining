//listing down each file in the particular folder using readdir 

//used to asynchronously list all the files in the given directroy 
const fs = require('fs');

// fs.readdir('./',(err,files)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(fs.Stats(files))
//     }
// })//list all the files in the current directory 


// fs.readdir('',(err,files)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(files)
//     }
// })//list all the files in the parent directory 


// fs.readdir('../Notes',(err,files)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(files)
//     }
// })//list all the files in the parent sibling


// const yash=fs.stat('hello.js',(err,Stats)=>
//     {if(err){console.log(err)}
// else{  
//     console.log(Stats.isFile())
// }})// to check if the given string is file?
// console.log(yash)

// fs.readdir('./',(err,files)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//        for(let i=0;i<files.length;i++){
//         fs.stat(files[i],(err,stat)=>{if(err){console.log(err)}
//         else{if(stat.isFile()){console.log(files[i])}}
//     })//this will print all the files in the particular folder 

// }
// console.log(files,'hello')//this will print all the things in the particular folder 
//     }
// })


const dir = fs.readdirSync('./')
console.log(dir)