const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },

    nAmount:{
        type: Number,
        required: true,
        default: 0
    },
    dDate:{
        type: Date,
        default: Date.now
    },
    aInventory:[
        {
            iInventoryId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true
            },
            nQuantity:{
                type: Number,
                required: true
            },
            dpurchaseDate:{
                type:Date,
                default: Date.now
            }
        }
    ]
});


const Expense = mongoose.model('Expense', expenseSchema)
module.exports = {Expense}