const {responseHandler,readItemFromFile,CheckFileExist,writeItemToFile,Item} = require('../utils/utils')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')


function displayStaticFile(req, res,filename) {
    // res.sendFile(path.join(__dirname, '../public', req.url));
    filename=req.url.split('/').pop()
    if(!filename){
        return responseHandler(res,404,'text/html','no file name found')
    }
    else{
        displayStaticFile1(res,filename)
    }
}

function displayStaticFile1(res,filename){
    const obj = {'.js':'text/javascript','.html':'text/html','.css':'text/css'}

    let sstaticpath = path.join(__dirname,'../public',filename)
    fs.stat(sstaticpath,(err,stat)=>{
        if(err){
           return responseHandler(res,404,'text/html','there was an error in reading the file')
        }
        else{
            if(!stat.isFile()){
                return responseHandler(res,404,'text/html','given filename is not a file')
            }
            else{
                sExtname=path.extname(sstaticpath) // getting extension name 
                sContentType=obj[sExtname]
                if(sContentType=='undefined'){
                    return responseHandler(res,404,'text/html','file type not supported')
                }
                else{
                    fs.readFile(sstaticpath,(err,data)=>{
                        if(err){
                            return responseHandler(res,404,'text/html','there was an error in reading the file')
                        }
                        else{
                            return responseHandler(res,200,sContentType,data)
                        }
                    })
                }
            }
        }
    })
    // res.end('done')
}

module.exports = {displayStaticFile};