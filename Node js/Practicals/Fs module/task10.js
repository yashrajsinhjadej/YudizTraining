// const  fs = require('fs')

// let data1=''
// let readstream = fs.createReadStream('yash.txt')
// readstream.setEncoding('utf-8')
// let counter=0
// readstream.on('data',(chunk)=>{
//     console.log('chunk came')
//     data1+=chunk
//     counter+=1
//     // console.log(chunk)
// })
// readstream.on('end',()=>{
//     console.log(data1)
//     console.log(counter)
// })



const fs = require('fs')

const readstream = fs.createReadStream('yash.txt')
let string= ''
readstream.on("data",(chunk)=>{
    string+=chunk
})
readstream.on("end",()=>{
    console.log(string)
})