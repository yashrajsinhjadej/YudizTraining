//print the content of a particular file 
const fs = require('fs')
// console.log(fs)
 

// //lets start with asynchronous


// fs.readFile('yash.txt',(err,data)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(data.toString())
//     }
// })

// //instead of converting the data.toString we can directly pass 'utf-8' in para 

// // for example 


// fs.readFile('yash.txt','utf-8',(err,data)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(data)
//     }
// })

// //reading file synchronusly

// try{
//     const data = fs.readFileSync('yash.txt','utf-8')
//     console.log(data)
// }
// catch(err){
//     console.log(err)
// }

//REading the file which is already opened 


fs.open('demo.txt',(err,fd)=>{
    buffer = Buffer.alloc(1024)//creating new buffer 
    fs.read(fd,buffer,0,buffer.length,0,(err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(buffer.toString()) 
            console.log(data)
        }
    })
})


/*  
    parameters of fs.read()
    fd-reference of the file 
    buffer-which variable the data is stored 
    0 starting position of data in buffer where data is stored
    buffer.length - upto how much bytes the data is stored 
    0 pointer of the file from where the file starts to read 
    data=pointes at the end of the file 
*/

