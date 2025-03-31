const fs = require('fs').promises
const { error } = require('console');
const path = require('path')
const process= require('process')
require('dotenv').config();


async function WriteToFile(sData){
    try{
        await fs.writeFile(process.env.File_Name,sData)
    }
    catch(err){
        throw new error('Error writing file: ' + err.message);
    }

}

module.exports={WriteToFile}