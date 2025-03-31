const {ReadFromFile} = require('../utils/readfile.js')
const {responseHandler} = require('../utils/response.js')


async function showItemList(req, res) {
    let sData;
    try{
    sData = await ReadFromFile();
    }
    catch(err){
        responseHandler(res,{statusmsg:"InternalServerError",sMsg:'there was error in reading the file'})//pass object as status and msg
    }
    responseHandler(res,{statusmsg:"OK",sMsg:'OK',sData})   
}

module.exports = {showItemList};