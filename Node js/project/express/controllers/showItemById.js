const {ReadFromFile} = require('../utils/readfile.js')
const {Item} = require('../models/class.js')
const {checkId}=require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

async function showItemById(req,res){
    const pId = req.params.id
    if(!checkId(pId)){
       responseHandler(res,{statusmsg:"BadRequest",sMsg:'ID is INVALID'})//pass object as status and msg
    }
    else{
        try{
        const sData = await ReadFromFile()
        let aData = JSON.parse(sData)
        let bfind = aData.find((obj)=>{return obj.pId==pId})
        if(!bfind){
                responseHandler(res,{statusmsg:"NotFound",sMsg:'Item not found'})//pass object as status and msg
            }
            else{            
                responseHandler(res,{statusmsg:"OK",sMsg:'Item found',sData:bfind})//pass object as status and msg
        }
        }
    catch(err){
        responseHandler(res,{statusmsg:"InternalServerError",sMsg:'there was error in readign the file'})//pass object as status and msg
    }
    }

    
}

module.exports={showItemById}

