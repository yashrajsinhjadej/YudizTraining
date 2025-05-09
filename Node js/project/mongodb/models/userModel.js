const mongoose = require('mongoose')

const userIdSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
})


const User = mongoose.model('Users', userIdSchema)
module.exports = {User}