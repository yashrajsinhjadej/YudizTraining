const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    type: String,
    unitPrice: Number,
    nQuantity: Number,
}, { strict: true }); // <-- Make sure strict is true or just omit this line

module.exports = mongoose.model('Inventory', inventorySchema, 'inventories');



