const bcrypt = require('bcrypt')

const hashedpassword = bcrypt.hashSync('admin@123',10)

const check = bcrypt.compareSync('admin@123',hashedpassword,10)
console.log(check)