const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid')
const http = require('http');
const fs = require('fs')
const eventemitter = require('events');
const { findPackageJSON } = require('module');
const path = require('path')
// let counter=0
// class to make the item objects 
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
function CheckFileExist(res,filename){
    try
    {
        fs.statSync(filename)
        if(fs.statSync(filename).isFile()){
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


function readItemById(res,nid,filename)
{

    let data = readItemFromFile(res,filename)
    if(data){
        if(JSON.parse(data).length==0){
            return responseHandler(res,200,'text/html','no data found')    
        }
        else{
            let adata;
            try{
             adata = JSON.parse(data)
            }
            catch(err){
                return responseHandler(res,404,'text/html','there was an error in parsing the data')
            }

        for(let i=0;i<adata.length;i++){
                if(adata[i].nid==nid){
                    return responseHandler(res,200,'application/json',JSON.stringify(adata[i]))
                }
            }
            return responseHandler(res,404,'text/html','no data found with that id')
        }
    }        
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
                return responseHandler(res,200,'text/html','data added success')
            }
        })
}


function writeInFile(res,obj,filename)
{
    let aData;
    let sData = readItemFromFile(res,filename)
    if(sData)
        {
            try{
            aData = JSON.parse(sData)
            }
            catch(err){
                return responseHandler(res,404,'text/html','there was an error in parsing the data')
            }
            aData.push(obj)
            // console.log(aData)
            let awritedata = JSON.stringify(aData) //converting the array of objects into json to rewrite in the string 
            return writeItemToFile(res,awritedata,filename)
}
return
}



function updateFileById(res,nid,oUpdatedata,filename)
{
    let sdata = readItemFromFile(res,filename)
    if(sdata)
        {
            let odata;
            let bflag=false;
            try{
                odata = JSON.parse(sdata)
            }catch(err){
                return responseHandler(res,404,'text/html','there was an error in parsing the data')
            }
            for(let i=0;i<odata.length;i++){
                if(odata[i].nid==nid){
                    bflag=true
                    odata[i].sName=oUpdatedata.sName
                    odata[i].nPrice=oUpdatedata.nPrice
                    odata[i].nQuantity=oUpdatedata.nQuantity
                    // console.log(oUpdatedata.nQuantity)
                    console.log('hello')
                    if(oUpdatedata.nQuantity){
                        odata[i].bStatus=true
                    }
                    else{
                        odata[i].bStatus=false
                    }
                    odata[i].dupdatedAt=new Date()
                    break                    
                }
            }
            if(!bflag){
                return responseHandler(res,404,'text/html','no data found with that id')
            }
            else{ 
                let sWdata = JSON.stringify(odata)
                return writeItemToFile(res,sWdata,filename)
            }
        }
        }
    
function deletItemById(res,nid,filename)
{
    let sData = readItemFromFile(res,filename)
    if(sData)
        {
            let adata;
            try{
                adata=JSON.parse(sData)}
                catch(err){
                    return responseHandler(res,404,'text/html','there was an error in parsing the data')
                }
                let aremovedeletea=adata.filter((obj)=>{
                    return obj.nid!=nid
                })
                
            if(adata.length==aremovedeletea.length){
                return responseHandler(res,404,'text/html','no data found with that id')
            }
            let owritedata=JSON.stringify(aremovedeletea)
            return writeItemToFile(res,owritedata,filename)       
        }
}
function displayStaticFile(res,filename){
    const obj = {'.js':'text/javascript','.html':'text/html','.css':'text/css'}

    let sstaticpath = path.join(__dirname,'/public',filename)
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


function responseHandler(res,nStatusCode=200,sContentType='text/html',sMessage=''){
    res.writeHead(nStatusCode,sContentType)
    res.end(sMessage)
    return 
}

//creating the server using http 
const server = http.createServer((req,res)=>{
   
    if(req.url=='/api/data' && req.method=='GET'){ //fetching all the data of data.json
        if(CheckFileExist(res,'data.json')){ // this functions checks if the given file exists or not 
        let data = readItemFromFile(res,'data.json')
        if(data){ //checking if there is any data in the file or not or if there is any error in reading the file
        return responseHandler(res,200,'application/json',data) //reading and displaying all the contents of the file in the web
    }
    } 
    else{return} //reading and displaying all the contents of the file in the web
    }



    else if(req.url.startsWith('/api/data') && req.method=='GET'){
        if(CheckFileExist(res,'data.json'))
            {
                const nid = req.url.split('/').pop() //getting the id from the url
                if(!uuid.validate(nid)){
                    return responseHandler(res,404,'text/html','invalid id') //checking if the id is valid or not
                }
                else{
                readItemById(res,nid,'data.json') //reading file and printing the data
                return
            }
        }else{return}
    }


    else if(req.url=='/api/data' && req.method=='POST'){
        
        let sdata = ''
        req.on('data',(chunk)=>{
            sdata+=chunk
        })    //getting data in chunks  
    
        req.on('end',()=>{
            if(CheckFileExist(res,'data.json')){
                let odata;
                try{
                 odata = JSON.parse(sdata)}
                catch(err){
                   return responseHandler(res,404,'text/html','there was an error in parsing the data')
                }
                //checks if any value is not defined or any random value is inserted 
                if((odata.sName==undefined||odata.nQuantity==undefined||odata.nPrice==undefined)||Object.keys(odata).length!=3){
                    return responseHandler(res,404,'text/html','data not valid')
                }//checks the validation of the data recved
                if(!(/^[a-zA-Z0-9]+/.test(odata.sName) && !(/^\d+/.test(odata.sName))&& /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                    return responseHandler(res,404,'text/html','validation is wrong')}
                else{
                    let obj = new Item(odata.sName,odata.nQuantity,odata.nPrice)
                     writeInFile(res,obj,'data.json')
                     return
                }
                }
                else{return}
        })

        req.on('error',(err)=>{
        if(err){
            return responseHandler(res,404,'text/html','there was an error in reading the data')
        }    
        })
    }


    else if(req.url.startsWith('/api/data')&&req.method=="PUT"){
        let nid = req.url.split('/').pop()
        let sdata = ''
        req.on('data',(chunk)=>{
            sdata+=chunk
        })
        req.on('end',()=>{
            if(CheckFileExist(res,'data.json')){
                let odata;
            try{
               odata=JSON.parse(sdata)}
              catch(err){
                return responseHandler(res,404,'text/html','there was an error in parsing the data')
              }
              if((odata.sName==undefined||odata.nQuantity==undefined||odata.nPrice==undefined)||Object.keys(odata).length!=3){
               return responseHandler(res,404,'text/html','data not valid')
            }//checks the validation of the data recved
            if(!(/^[a-zA-Z0-9]+/.test(odata.sName)&&!(/^\d+/.test(odata.sName)) && /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                return responseHandler(res,404,'text/html','validation is wrong')
            } 
            if(!uuid.validate(nid)){
                return responseHandler(res,404,'text/html','invalid id')
            }
            else{
                updateFileById(res,nid,odata,'data.json')
            }
          }  
        })
        req.on('error',(err)=>{
            if(err){
                return responseHandler(res,404,'text/html','there was an error in reading the data')
            }
        })
    } 

    else if (req.url.startsWith('/api/data')&&req.method=="DELETE"){
        let nid = req.url.split('/').pop()
        if(CheckFileExist(res,'data.json')){
            if(!uuid.validate(nid)){
               return responseHandler(res,404,'text/html','invalid id')
            }
            else{
            deletItemById(res,nid,'data.json')
        }}
    }

    else if(req.url.startsWith('/api/public')&&req.method=='GET')
    {
        filename=req.url.split('/').pop()
        if(!filename){
            return responseHandler(res,404,'text/html','no file name found')
        }
        else{
            displayStaticFile(res,filename)
        }
    }
    
})


server.listen(3000,(err)=>
    {
        if(err){
            console.log(err)
        }
        else{
            console.log('server is running on the port 3000')
        }
    }) 