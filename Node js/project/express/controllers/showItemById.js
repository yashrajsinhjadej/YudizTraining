const {ReadFromFile} = require('../utils/readfile.js')
const {Item} = require('../models/class.js')
const {checkId}=require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

function showItemById(req,res){
    pId = req.params.id
    if(!checkId(pId)){
        responseHandler(res,400,'ID is INVALID')
    }
    else{
        const sData = ReadFromFile()
        if(!sData){
            responseHandler(res,500,'there was an error in reading the data')
        }
        else{
            let aData = JSON.parse(sData)
            let find = aData.find((obj)=>{return obj.pId==pId})
            if(!find){
                responseHandler(res,404,'Not found')
            }
            else{            
                responseHandler(res,200,find)
        }
        }
    }
    
}

module.exports={showItemById}

