const utils = require('../utils/utils')
const {displayAllData} =require('../controller/displayAllData')
const {displayDataById} =require('../controller/displayDataById')
const {addItemToFile} =require('../controller/addItemToFile')
const config = require('../config')

exports.handleRoutes=(req,res)=>{
    pId=req.url.split('/')[3]
    if (pId){
        let sUrl=req.url.split('/')
        sUrl.pop()
        let sJoinUrl=sUrl.join('/')
        sCombo = req.method+sJoinUrl+'/:id'
    }
    else{
        sCombo = req.method+req.url
    }
    const route ={
        'GET/api/data':()=>{displayAllData(req,res,config.dataFilePath)},
        'POST/api/data':()=>{addItemToFile(req,res,config.dataFilePath)},
        'PUT/api/data':()=>{res.end('done2')},
        'DELETE/api/data':()=>{res.end('done3')},
        'GET/api/data/:id':()=>{displayDataById(req,res,config.dataFilePath)},
        'PUT/api/data/:id':()=>{res.end('done5')},
        'DELETE/api/data/:id':()=>{res.end('done6')},
    }
    console.log(sCombo)
    if(route[sCombo]){
        route[sCombo]()
    }
    else{
        utils.responseHandler(res,404,'text/html','route not found')
    } 
}