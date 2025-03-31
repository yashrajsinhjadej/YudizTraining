const {ReadFromFile} = require('../utils/readfile.js')
const {WriteToFile} = require('../utils/writeFile.js')
const {Item} = require('../models/class.js')
const {checkvalidation} = require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

async function addItemList(req, res) {
    let oData = req.body
    if (!checkvalidation(oData)) {
        responseHandler(res,{statusmsg:"BadRequest",sMsg:'validation wrong'})//pass object as status and msg
    } 
    else {
        let oItem = new Item(oData.sName, +oData.nQuantity, +oData.nPrice)
        try{
            let sData = await ReadFromFile()
            let aData = JSON.parse(sData)
            // console.log(oItem)
            let bflag=aData.some((obj)=>{return obj.sName==oItem.sName})
            console.log(bflag)
            if(bflag){
                responseHandler(res,{statusmsg:"BadRequest",sMsg:'Item already exists'})//pass object as status and msg
            }
            else{
            aData.push(oItem)
            sData = JSON.stringify(aData)
            await WriteToFile(sData)
            responseHandler(res,{statusmsg:"OK",sMsg:'Item added successfully',sData:oItem})//pass object as status and msg 
        }}
        catch(err)
        {
            responseHandler(res,{statusmsg:"InternalServerError",sMsg:'there was error in the file handling'})//pass object as status and msg
        }     
    }
}
module.exports = { addItemList }


