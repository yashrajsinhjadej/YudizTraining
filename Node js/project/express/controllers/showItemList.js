const {ReadFromFile} = require('../utils/readfile.js')
const {responseHandler} = require('../utils/response.js')


function showItemList(req, res) {
    console.log('ht')
    const sData = ReadFromFile();
    if(!sData){
      return responseHandler(res,500,'there was an error in reading the data')
    }
    else{
        let aData = JSON.parse(sData)
        responseHandler(res,200,sData)   
    }
}


module.exports = {showItemList};