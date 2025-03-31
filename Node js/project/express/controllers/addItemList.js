const {ReadFromFile} = require('../utils/readfile.js')
const {WriteToFile} = require('../utils/writeFile.js')
const {Item} = require('../models/class.js')
const {checkvalidation} = require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

function addItemList(req, res) {
    let oData = req.body
    // console.log('hello')
    if (!checkvalidation(oData)) {
        return responseHandler(res, 400, 'Bad request')
        
    } else {
        let oItem = new Item(oData.sName, +oData.nQuantity, +oData.nPrice)
        let sData = ReadFromFile()
        if (sData) {
            let aData = JSON.parse(sData)
            aData.push(oItem)
            sData = JSON.stringify(aData)
            let bflag = WriteToFile(sData)

            if (bflag) {
                return responseHandler(res, 201, 'Item is created')
            } else {
                return responseHandler(res, 400, 'Bad request')
            }
        }

        return responseHandler(res, 200, 'hell')
    }
}

module.exports = { addItemList }


