const  fs = require('fs')

let data1=''
let readstream = fs.createReadStream('input.txt')
readstream.setEncoding('utf-8')
readstream.on('data',(chunk)=>{
    data1+=chunk
    // console.log(chunk)
})
readstream.on('end',()=>{
    console.log(data1)
})