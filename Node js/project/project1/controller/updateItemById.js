const {responseHandler,readItemFromFile,CheckFileExist,writeItemToFile} = require('../utils/utils')
const uuid = require('uuid')
function updateItemById(req, res,filename) {
    let nid = req.url.split('/').pop()
            let sdata = ''
            req.on('data',(chunk)=>{
                sdata+=chunk
            })
            req.on('end',()=>{
                if(CheckFileExist(res,filename)){
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

                module.exports={updateItemById}