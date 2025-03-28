const fs = require('fs')
const path = require('path')
const process= require('process')
require('dotenv').config();


function WriteToFile(sData){
    try{
        fs.writeFileSync(process.env.File_Name,sData)
        return true
    }
    catch(err){
        return false
    }

}

module.exports={WriteToFile}