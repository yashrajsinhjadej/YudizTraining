const {createHash,randomBytes,scryptSync} = require('crypto')


function hashsalt(input)
{
    let salt = randomBytes(16).toString('hex') 
    return scryptSync(input,salt,32);
}
function hash(input){
    return createHash('sha256').update(input).digest('hex')
}

let password = 'Yashraj@123'
let hash2=hash(password)
console.log(hash2)
let hash1=hashsalt(password)
console.log(hash1.toString('hex')) //to convert buffer to hex format