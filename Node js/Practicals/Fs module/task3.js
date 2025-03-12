const fs = require('fs')


const files =fs.readdirSync('./') //synchronously reading the files 
// console.log(dir)
for(let i=0;i<files.length;i++){
        fs.stat(files[i],(err,stat)=>{if(err){console.log(err)}
        else{if(stat.isFile()){
            //now we know this particular name is file
            let temp=files[i].split('.')
            if(temp.at(-1)=='js'){// js directly do not support temp[-1]
                console.log(files[i])
            }
            // console.log(temp[temp.length-1])

        }}
    })    
}