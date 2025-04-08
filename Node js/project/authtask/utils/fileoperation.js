const fs = require('fs').promises 

async function ReadFromFile(filepath) { 

    try {
        const data = await fs.readFile(filepath, 'utf8'); 
        return data;
    } catch (err) {
        throw new Error('Error reading file: ' + err.message);
    }
}


async function WriteToFile(data,filepath) {
    try {
        await fs.writeFile(filepath, data, 'utf8'); 
    } catch (err) {
        throw new Error('Error writing to file: ' + err.message);
    }
}

module.exports = { ReadFromFile, WriteToFile };