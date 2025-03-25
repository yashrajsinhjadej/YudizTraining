const {responseHandler,readItemFromFile,CheckFileExist} = require('../utils/utils')

// console.log(filename)

function displayAllData(req,res,filename){
    console.log(filename,'filename')
    if(CheckFileExist(res,filename)){
        console.log(filename,'filename')
        let data = readItemFromFile(res,filename)
        responseHandler(res,200,'text/html',data)
        
    }
}

module.exports={displayAllData}


