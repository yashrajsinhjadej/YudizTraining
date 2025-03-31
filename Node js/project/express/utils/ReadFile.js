const fs = require('fs').promises // for using async await got from stack overflow
const { error } = require('console');
const process= require('process')
require('dotenv').config();
//pass by default value in config file 
async function ReadFromFile() { 
    const filepath = process.env.FILE_NAME; 
    try {
        const data = await fs.readFile(filepath, 'utf8'); 
        return data;
    } catch (err) {
        throw new Error('Error reading file: ' + err.message);
    }
}

module.exports={ReadFromFile}