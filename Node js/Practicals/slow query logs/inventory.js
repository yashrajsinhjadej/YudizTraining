const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    type: String,
    unitPrice: Number,
    nQuantity: Number,
}, { versionKey: '__v' }); 

module.exports = mongoose.model('Inventory', inventorySchema, 'inventories');



