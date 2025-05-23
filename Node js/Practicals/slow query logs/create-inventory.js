const mongoose = require('mongoose');
const Inventory = require('./inventory');


async function createInventory() {
  await mongoose.connect('mongodb://localhost:27017/test');

  const doc = new Inventory({
    type: "PHARMACY",
    unitPrice: 100,
    nQuantity: 10
  });

  await doc.save();
  console.log('Created:', doc);

  await mongoose.disconnect();
}

createInventory();