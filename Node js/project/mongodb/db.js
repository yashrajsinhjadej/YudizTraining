const mongoose = require('mongoose');
require('dotenv').config()
function connectDb(){
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(()=>{console.log('mongodb connected')})
.catch((err)=>{console.log(err)})
}


module.exports = {connectDb}