const fs = require('fs')    
const uuidv4 = require('uuid').v4

function responseHandler(res,nStatusCode=200,sContentType='text/html',sMessage=''){
    res.writeHead(nStatusCode,sContentType)
    res.end(sMessage)
    return 
}

function readItemFromFile(res,filename){
        let data;
            try{
            data = fs.readFileSync(filename,'utf-8')
        }
        catch(err){
            return responseHandler(res,404,'text/html','there was an error in reading the file')
        }

        if(!data){
            return responseHandler(res,404,'text/html','there was an error in reading the file')
        }
        else{
              return data 
        }}



function writeItemToFile(res,awritedata,filename){
    fs.writeFile(filename,awritedata,(err)=>
        {
            if(err){
                return responseHandler(res,404,'text/html','there was an error in writing the file')
            }
            else{
                return responseHandler(res,200,'text/html','done')
            }
        })
}

function CheckFileExist(res,filename){
    try
    {   
        if(fs.statSync(filename).isFile()){
            // console.log(data,'hg')
            return true
        }
        else{
            return responseHandler(res,404,'text/html','given filename is not a file')
            
        }
    }
    catch(err)
    {   return responseHandler(res,404,'text/html','file does not exist')
    }

}
class Item{
    constructor(Name,Quantity,Price){
        this.nid=uuidv4()
        this.sName=Name
        this.nQuantity=Quantity
        this.nPrice=Price
        if(this.nQuantity){
            this.bStatus=true
        }
        else{
            this.bStatus=false
        }
        this.dCreatedAt=new Date()
        this.dupdatedAt=new Date()      
    }
}
module.exports={responseHandler,readItemFromFile,writeItemToFile,CheckFileExist,Item}