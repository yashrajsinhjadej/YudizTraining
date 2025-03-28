const {ReadFromFile} = require('../utils/readfile.js')
const {WriteToFile} = require('../utils/writeFile.js')
const {Item} = require('../models/class.js')
const {checkId, checkvalidation} = require('../validations/newitem')
const {responseHandler} = require('../utils/response.js')

function deleteItemById(req, res) {
    let pId = req.params.id 
    if (!checkId(pId)) {
        responseHandler(res, 400, 'ID is INVALID')
    }    
    else {
        let sData = ReadFromFile()
        if (!sData) {
            responseHandler(res, 500, 'There was an error in reading the data')
        }
        else {
            let aData = JSON.parse(sData)
            let aRemovedelete = aData.filter((obj) => {
                return obj.pId != pId
            })

            if (aRemovedelete.length == aData.length) {
                responseHandler(res, 404, 'Not found')
            } 
            else {
                let bflag = WriteToFile(JSON.stringify(aRemovedelete))
                if (!bflag) {
                    responseHandler(res, 500, 'There was an error in writing the file')
                }
                else {
                    responseHandler(res, 200, 'Deleted')  
                }
            }
        }
    }
}

module.exports = { deleteItemById }