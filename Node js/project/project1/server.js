const { v4: uuidv4 } = require('uuid');
const http = require('http');
const fs = require('fs')
const eventemitter = require('events');
const { findPackageJSON } = require('module');

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
function CheckFileExist(req,res,filename){
    try
    {
        fs.statSync(filename)
        if(fs.statSync(filename).isFile()){
            return true
        }
        else{
            res.writeHead(404,{'Content-Type':'text/html'})
            res.write('<h1>given filename is not a file</h1> ')
            res.end()
            return false
        }
        // return true
    }
    catch(err)
    {
        res.writeHead(404,{'Content-Type':'text/html'})
        res.write('<h1>File does not exist </h1> ')
        res.end()
        return false
    }

}


function readFileById(req,res,nid,filename)
{
    // console.log('hello1')
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})  
            console.log('err')
            res.end('there was an error on getting the data')
            return false
        }
        else{
            // console.log(JSON.parse(data).length)
            if(JSON.parse(data).length==0){
                res.writeHead(200,{'Content-Type':'text/html'})
                console.log('no data ')
                res.end('fetching succesful but no data in file')
                return true
            }
            else{
                const adata = JSON.parse(data)
                for(let i=0;i<adata.length;i++){
                    if(adata[i].nid==nid){
                        res.writeHead(200,{'Content-Type':'text/html'})
                        console.log('data')
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

function readFile(req,res,filename){
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})  
            res.end('there was an error on getting the data')
        }
        else{
            res.writeHead(200,{'Content-Type':'text/html'})
            if(JSON.parse(data).length==0){
                res.end('fetching succesful but no data in file')
            }
            else{
            res.end(data)
        }
        }
    })
}


function writeInFile(req,res,obj,filename)
{
    fs.readFile(filename,(err,data)=>{
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'})
            res.end('there was error in reading the file')
            return
        }
        else{
            let adata=JSON.parse(data)  // converting the json into array of objects 
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
            let odata = JSON.parse(data)
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
                console.log(odata)
                console.log('data found writing the data into the file')
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
            let adata=JSON.parse(data)
            console.log(adata)
            let aremovedeletea=adata.filter((obj)=>{
                return obj.nid!=nid
            })
            console.log(aremovedeletea,'aremovedelete')
            if(adata.length==aremovedeletea.length){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('no person with particular id found')
            }
            else{
                // console.log(aremovedeletea)
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

//creating the server using http 
const server = http.createServer((req,res)=>{
   
    if(req.url=='/api/data' && req.method=='GET'){ //fetching all the data of data.json
        if(CheckFileExist(req,res,'data.json')){ // this functions checks if the given file exists or not 
        readFile(req,res,'data.json')}  //reading and displaying all the contents of the file in the web
    }



    else if(req.url.startsWith('/api/data') && req.method=='GET'){
        if(CheckFileExist(req,res,'data.json'))
            {
                // console.log('done')
                const nid = req.url.split('/').pop() //getting the id from the url
                readFileById(req,res,nid,'data.json') //reading file and printing the data
            }
    }


    else if(req.url=='/api/data' && req.method=='POST'){
        // console.log('post method called')
        let sdata = ''
        req.on('data',(chunk)=>{
            sdata+=chunk
        })    
    
        req.on('end',()=>{
            if(CheckFileExist(req,res,'data.json')){
                let odata = JSON.parse(sdata)
                console.log(odata)
                //checks if any value is not defined or any random value is inserted 
                if((odata.sName==undefined||odata.nQuantity==undefined||odata.nPrice==undefined)||Object.keys(odata).length!=3){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('data not valid')
                    return
                }//checks the validation of the data recved
                if(!(/^[a-zA-Z0-9]+/.test(odata.sName) && /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                    res.writeHead(404,{'Content-Type':'text/html'})
                    res.end('validation is wrong')
                }
                else{
                    let obj = new Item(odata.sName,odata.nQuantity,odata.Price)
                    console.log(obj)
                   writeInFile(req,res,obj,'data.json')
                }
                }
        })
    }


    else if(req.url.startsWith('/api/data')&&req.method=="PUT"){
        let sdata = ''
        req.on('data',(chunk)=>{
            sdata+=chunk
        })
        let nid = req.url.split('/').pop()
        console.log(nid)
        
        req.on('end',()=>{
            if(CheckFileExist(req,res,'data.json')){
              let odata=JSON.parse(sdata)
              if((odata.sName==undefined||odata.nQuantity==undefined||odata.nPrice==undefined)||Object.keys(odata).length!=3){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('data not valid')
                return
            }//checks the validation of the data recved
            if(!(/^[a-zA-Z0-9]+/.test(odata.sName) && /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.end('validation is wrong')
                return
            }
            else{
                updateFileById(req,res,nid,odata,'data.json')
            }
          }  
        })
    } 






    else if (req.url.startsWith('/api/data')&&req.method=="DELETE"){
        let nid = req.url.split('/').pop()
        if(CheckFileExist(req,res,'data.json')){
        deletItemById(req,res,nid,'data.json')
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