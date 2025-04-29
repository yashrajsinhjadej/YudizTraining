const mongoose = require('mongoose');


const aInventorySchema = new mongoose.Schema({
    type:{
        type:String,
        enum: ['FOOD', 'PHARAMACY', 'CLOTHES', 'ELECTRONICS', 'OTHER'],
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    nQuantity: {
        type: Number,
        required: true
    }
})

const Inventory= mongoose.model('Inventory',aInventorySchema)
module.exports = {Inventory}
