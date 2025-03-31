const fs = require('fs')
const path = require('path')
const process= require('process')
require('dotenv').config();
//pass by default value in config file 
function ReadFromFile(){
    const filepath=process.env.File_Name
    let data ;
    try{
        data = fs.readFileSync(filepath, 'utf8')
    }
    catch (err) {
        return ''
    }
    return data
}

module.exports={ReadFromFile}