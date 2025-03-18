// deleting only particular type of the file in node js 
const fs = require('fs')

fs.readdir('temp',(err,files)=>{
    if(err){
        console.log(err)
    }
    else{
         for(let i=0;i<files.length;i++){
            const stat=fs.statSync(`temp/${files[i]}`)
            if(stat.isFile()){
                let ext = files[i].split('.')
                if(ext.at(-1)=='js'){
                    fs.unlinkSync(`temp/${files[i]}`)
                    console.log('file deleted',files[i])
                }
            }

        }
    }}
)