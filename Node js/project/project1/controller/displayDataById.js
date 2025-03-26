const {responseHandler,readItemFromFile,CheckFileExist} = require('../utils/utils')
const uuid = require('uuid')
const fs = require('fs')

function displayDataById(req, res,filename) {
   if(CheckFileExist(res,filename))
              {
                  const nid = req.url.split('/').pop() //getting the id from the url
                  if(!uuid.validate(nid)){
                      return responseHandler(res,404,'text/html','invalid id') //checking if the id is valid or not
                  }
                  else{
                    let sData = readItemFromFile(res,filename)
                    if(sData){if(JSON.parse(sData).length==0){
                      return responseHandler(res,200,'text/html','no data found')    
                  }
                  else{
                      let adata;
                      try{
                       adata = JSON.parse(sData)
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
                  }}
              }
          }
          else
          {
            return
          }
}

module.exports = {displayDataById};

