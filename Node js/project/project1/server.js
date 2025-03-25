const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid')
const http = require('http');
const fs = require('fs')
const eventemitter = require('events');
const { findPackageJSON } = require('module');
const path = require('path')

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


function readFileById(res,nid,filename)
{
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})  
            
            res.end('there was an error on getting the data')
            return false
        }
        else{
            if(JSON.parse(data).length==0){
                res.writeHead(200,{'Content-Type':'text/html'})
                
                res.end('fetching succesful but no data in file')
                return true
            }
            else{
                let adata;
                try{
                 adata = JSON.parse(data)
                }
                catch(err){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('there was an error in parsing the data')
                    return false
                }

            for(let i=0;i<adata.length;i++){
                    if(adata[i].nid==nid){
                        res.writeHead(200,{'Content-Type':'text/html'})
                        
                        res.write(JSON.stringify(adata[i]))
                        res.end()
                        return true
                    }
                }
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('NO Data found')
                return false
            }
        }   
    })
}

function readFile(res,filename){
let data;
    try{
    data = fs.readFileSync(filename,'utf-8')
}
catch(err){
    return responseHandler(res,404,'text/html','there was an error in reading the file')
}

return data}

function writeInFile(req,res,obj,filename)
{
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('there was error in reading the file')
            return
        }
        else{
            let adata;
            try{
                adata=JSON.parse(data) }
                catch(err){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('there was an error in parsing the data')
                    return
                } // converting the json into array of objects 
            adata.push(obj) //pushing new object into the array 
            // res.end(JSON.stringify(adata))
            let awritedata = JSON.stringify(adata) //converting the array of objects into json to rewrite in the string 
            fs.writeFile(filename,awritedata,(err)=>
                {
                    if(err){
                        res.writeHead(404,{'Content-Type':'text/html'})
                        res.end('there was error in writing the file')
                        return
                    }
                    else{
                        res.writeHead(201,{'Content-Type':'text/html'})
                        res.end('data inserted')
                        return
                    }
                })

        }   
        
    })
}



function updateFileById(req,res,nid,oUpdatedata,filename)
{
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('there was an error in reading the file')
            return 
        }
        else{
            let odata;
            try{ odata = JSON.parse(data)
            }
            catch(err){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('there was an error in parsing the data')
                return
            }
            
            
            let bflag=false
            for(let i=0;i<odata.length;i++){
                if(odata[i].nid==nid){
                    bflag=true
                    odata[i].sName=oUpdatedata.sName
                    odata[i].nPrice=oUpdatedata.nPrice
                    odata[i].nQuantity=oUpdatedata.nQuantity
                    if(oUpdatedata.Quantity){
                        odata[i].status=true
                    }
                    else{
                        odata[i].status=false
                    }
                    odata[i].dupdatedAt=new Date()
                    break                    
                }
            }
            if(!bflag){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('no data found with that id')
                return
            }
            else{
               
                let wdata = JSON.stringify(odata)
                fs.writeFile(filename,wdata,(err)=>{
                    if(err){
                        res.writeHead(404,{'Content-Type':'text/html'})
                        res.end('there was an error writing in the file')
                        return
                    }
                    else{
                        res.writeHead(200,{'Content-Type':'text/html'})
                        res.end('data added success')
                        return
                    }
                })

            }


        }
    })
}

function deletItemById(req,res,nid,filename)
{
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('there was an error in writing the file')
            return
        }
        else{
            let adata;
            try{
                adata=JSON.parse(data)}
                catch(err){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('there was an error in parsing the data')
                    return
                }
            let aremovedeletea=adata.filter((obj)=>{
                return obj.nid!=nid
            })
            if(adata.length==aremovedeletea.length){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('no person with particular id found')
            }
            else{
               
                let owritedata=JSON.stringify(aremovedeletea)
                fs.writeFile(filename,owritedata,(err)=>{
                    if(err){
                        res.writeHead(404,{'Content-Type':'text/html'})
                        res.end('there was an error in writing the file')
                    }
                    else{
                        res.writeHead(200,{'Content-Type':'text/html'})
                        res.end('data delted success')
                    }
                })
            }
        }        
    })
}
function displayStaticFile(req,res,filename){
    const obj = {'.js':'text/javascript','.html':'text/html','.css':'text/css'}

    let sstaticpath = path.join(__dirname,'/public',filename)
    fs.stat(sstaticpath,(err,stat)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('no file found')
        }
        else{
            if(!stat.isFile()){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('the given string is directory not file')
            }
            else{
                sExtname=path.extname(sstaticpath) // getting extension name 
                sContentType=obj[sExtname]
                if(sContentType=='undefined'){
                    res.writeHead(404,{'Content-Type':"text/html"})
                    res.end('file should be html css or js')
                    return
                }
                else{
                    fs.readFile(sstaticpath,(err,data)=>{
                        if(err){
                            res.writeHead(404,{'Content-Type':'text/html'})
                            res.end('there was an error in reading the file')
                        }
                        else{
                            res.end(data)
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
        let data = readFile(res,'data1.json')
        if(!data){
        return responseHandler(res,404,'application/json','there was error in reading the file') //reading and displaying all the contents of the file in the web
        }
        else{
            return responseHandler(res,200,'application/json',data) //reading and displaying all the contents of the file in the web
        }
    }  //reading and displaying all the contents of the file in the web
    }



    else if(req.url.startsWith('/api/data') && req.method=='GET'){
        if(CheckFileExist(res,'data.json'))
            {
                const nid = req.url.split('/').pop() //getting the id from the url
                if(!uuid.validate(nid)){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('invalid id')
                }
                else{
                readFileById(req,res,nid,'data.json') //reading file and printing the data
            }}
    }


    else if(req.url=='/api/data' && req.method=='POST'){
        
        let sdata = ''
        req.on('data',(chunk)=>{
            sdata+=chunk
        })    
    
        req.on('end',()=>{
            if(CheckFileExist(req,res,'data.json')){
                let odata;
                try{
                 odata = JSON.parse(sdata)}
                catch(err){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('there was an error in parsing the data')
                    return
                }
                //checks if any value is not defined or any random value is inserted 
                if((odata.sName==undefined||odata.nQuantity==undefined||odata.nPrice==undefined)||Object.keys(odata).length!=3){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('data not valid')
                    return
                }//checks the validation of the data recved
                if(!(/^[a-zA-Z0-9]+/.test(odata.sName) && !(/^\d+/.test(odata.sName))&& /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('validation is wrong')
                }
                else{
                    let obj = new Item(odata.sName,odata.nQuantity,odata.nPrice)
                   writeInFile(req,res,obj,'data.json')
                }
                }
        })

        req.on('error',(err)=>{
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('there was an error in reading the data')
        })
    }


    else if(req.url.startsWith('/api/data')&&req.method=="PUT"){
        let sdata = ''
        req.on('data',(chunk)=>{
            sdata+=chunk
        })
        let nid = req.url.split('/').pop()
         
        req.on('end',()=>{
            if(CheckFileExist(req,res,'data.json')){
                let odata;
            try{
               odata=JSON.parse(sdata)}
              catch(err){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('there was an error in parsing the data')
                return
              }
              if((odata.sName==undefined||odata.nQuantity==undefined||odata.nPrice==undefined)||Object.keys(odata).length!=3){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('data not valid')
                return
            }//checks the validation of the data recved
            if(!(/^[a-zA-Z0-9]+/.test(odata.sName)&&!(/^\d+/.test(odata.sName)) && /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('validation is wrong')
                return
            } 
            if(!uuid.validate(nid)){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('invalid id')
            }
            else{
                updateFileById(req,res,nid,odata,'data.json')
            }
          }  
        })
        req.on('error',(err)=>{
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('there was an error in reading the data')
        })
    } 

    else if (req.url.startsWith('/api/data')&&req.method=="DELETE"){
        let nid = req.url.split('/').pop()
        if(CheckFileExist(req,res,'data.json')){
            if(!uuid.validate(nid)){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('invalid id')
            }
            else{
        deletItemById(req,res,nid,'data.json')
        }}
    }

    else if(req.url.startsWith('/api/public')&&req.method=='GET')
    {
        filename=req.url.split('/').pop()
        if(!filename){
            res.writeHead(404,{'content-Type':'text/html'})
            res.end('filename not found')
            return
        }
        else{

            displayStaticFile(req,res,filename)

        }
    }
    
})




//console.log('hello')

server.listen(3000,(err)=>
    {
        if(err){
            console.log(err)
        }
        else{
            console.log('server is running on the port 3000')
        }
    }) 




// hello my name is yashraj