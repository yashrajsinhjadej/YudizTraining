const mongoose = require('mongoose')


const budgetSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    nDailybudget:{
        type:Number,
        required:true,
        default:0
    },
    nMonthlybudget:{
        type:Number,
        required:true,
        default:0
    },
    nWeeklybudget:{
        type:Number,
        required:true,
        default:0
    },
    dExpiryDate:{
        type: Date,
        default: new Date(Date.now() + 24*60*60*1000*31) 
    }
})


const Budget = mongoose.model('Budget', budgetSchema)
module.exports = {Budget}