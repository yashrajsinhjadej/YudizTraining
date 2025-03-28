const {ReadFromFile} = require('../utils/readfile.js')
const {WriteToFile} = require('../utils/writeFile.js')
const {Item} = require('../models/class.js')
const {checkId,checkvalidation}=require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

function updateItemById(req,res){
    let oData = req.body 
    let pId=req.params.id
    if(!checkId(pId)||!checkvalidation(oData)){
        // res.send('validation wrong')
        responseHandler(res,400,'validation wrong')
    }
    else{
        let sData = ReadFromFile()
        if(!sData){
            // res.send('there was an error reading the data')
            responseHandler(res,500,'there was an error reading the data')
        }
        else{
            let aData=JSON.parse(sData)
            let flag=false
            aData.forEach(element => {
                if(element.pId==pId){
                    element.sName=oData.sName
                    element.nQuantity=+oData.nQuantity
                    element.nPrice=+oData.nPrice
                    flag=true
                }
            });
            if(!flag){
                // res.send('no one found')
                responseHandler(res,404,'no one found')
            }
            else{
                sData=JSON.stringify(aData)
                let bflag=WriteToFile(sData)
                if(bflag){
                    // res.send('Item updated')
                    responseHandler(res,200,'Item updated')
                }
                else{
                    // res.send('there was an error')   
                    responseHandler(res,500,'there was an error')
                }    
            }
        }
    }
}


module.exports = {updateItemById}