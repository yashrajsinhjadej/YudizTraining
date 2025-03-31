const {ReadFromFile} = require('../utils/readfile.js')
const {responseHandler} = require('../utils/response.js')


function showItemList(req, res) {
    // console.log('ht')
    const sData = ReadFromFile();
  // jngruiun
    if(!sData){
      return responseHandler(res,500,'Internal Server Error')//pass object as status and msg
    }
    else{
        let aData = JSON.parse(sData)
        responseHandler(res,200,sData)   
    }
}


module.exports = {showItemList};