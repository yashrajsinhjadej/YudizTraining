const {ReadFromFile} = require('../utils/readfile.js')
const {WriteToFile} = require('../utils/writeFile.js')
// const {Item} = require('../models/class.js')
const {checkId} = require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

async function deleteItemById(req, res) {
    let {pId} = req.params 
    if (!checkId(pId)) {
        responseHandler(res, { statusmsg: "BadRequest", sMsg: "validation wrong" });
    }    
    else {
        try{
            let sData = await ReadFromFile()
            let aData = JSON.parse(sData)
            let aRemovedelete = aData.filter((obj) => {
                return obj.pId != pId
            })
            if (aRemovedelete.length == aData.length) {
                responseHandler(res,{statusmsg:"NotFound",sMsg:'Item not found'})
            } 
            else {
            await WriteToFile(JSON.stringify(aRemovedelete))
            // console.log(aRemovedelete)
            responseHandler(res,{statusmsg:"OK",sMsg:'ITEM deleted successfully'})     
            }
        }
        catch(err){
            responseHandler(res,{statusmsg:"InternalServerError",sMsg:'there was error in reading the file'})
        }
            
        
    }
}

module.exports = { deleteItemById }