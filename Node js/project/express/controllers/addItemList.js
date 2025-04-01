const {ReadFromFile} = require('../utils/readfile.js')
const {WriteToFile} = require('../utils/writeFile.js')
const {Item} = require('../models/class.js')
const {responseHandler} = require('../utils/response.js')

async function addItemList(req, res) {
        let {sName,nQuantity,nPrice}= req.body
        let oItem = new Item(sName,nQuantity,nPrice)
        try{
            let sData = await ReadFromFile()
            let aData = JSON.parse(sData)
            // console.log(oItem)
            let bflag=aData.some((obj)=>{return obj.sName==sName})
            // console.log(bflag)
            if(bflag){
                responseHandler(res,{statusmsg:"BadRequest",sMsg:'Item already exists'})
            }
            else{
            aData.push(oItem)
            sData = JSON.stringify(aData)
            await WriteToFile(sData)
            responseHandler(res,{statusmsg:"OK",sMsg:'Item added successfully',sData:oItem})
        }}
        catch(err)
        {
            responseHandler(res,{statusmsg:"InternalServerError",sMsg:'there was error in the file handling'})
        }     
    }

module.exports = { addItemList }


