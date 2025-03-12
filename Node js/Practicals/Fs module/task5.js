//writing contents in yash.txt

const fs = require('fs')

//asynchronously

// fs.writeFile('input.txt','hi yashraj how are you',(err)=>{
//     if(err){
//         console.log(err)
//     }
// else{
// console.log('done')
// }
// })


//synchrnously

// try{
    
// fs.writeFileSync('input1.txt','hi rishi how are you ?')
// }
// catch(err){
//     console.log(err)
// }



// when the file is already oopened 

fs.open('input.txt','w',(err,fd)=>{
    fs.write(fd,'this is how it is done',(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log('done')
        }
    })
})

/* 
all the descriptor
w-used for only writing in the file created new file if not and erase the previous data 
w+-used for both reading and writing created new file if not and erase the previous data 
r=used for only reading in the file gives err if not exist 
r+= used for both reading and writing gives err if file not exist 
a=used to only write but at the end of the text if file not then created do not erase the previous data
a+ = used to both read and write , and other things same as a 
*/

