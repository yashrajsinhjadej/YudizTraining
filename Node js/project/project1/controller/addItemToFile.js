const {responseHandler,readItemFromFile,CheckFileExist,writeItemToFile,Item} = require('../utils/utils')
const uuid = require('uuid')


function addItemToFile(req, res,filename)
 {

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
                }//checks the validation of the data recieved
                if(!(/^[a-zA-Z0-9]+/.test(odata.sName) && !(/^\d+/.test(odata.sName))&& /^\d+/.test(odata.nQuantity) && /^\d+/.test(odata.nPrice))){
                    return responseHandler(res,404,'text/html','validation is wrong')}
                else{
                    let obj = new Item(odata.sName,odata.nQuantity,odata.nPrice)
                    let sdata = readItemFromFile(res,filename)
                    if(sdata){
                        let adata = JSON.parse(sdata)
                        adata.push(obj)
                        writeItemToFile(res,JSON.stringify(adata),filename)
                        return
                    }
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
module.exports = {addItemToFile};