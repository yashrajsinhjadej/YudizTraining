const mongoose = require('mongoose');
const Inventory = require('./inventory');

async function runDemo() {
  await mongoose.connect('mongodb://localhost:27017/test');

  const inventoryA = await Inventory.findOne({ type: "PHARMACY" });
  const inventoryB = await Inventory.findOne({ _id: inventoryA._id });


  inventoryA.unitPrice = 200;
  await inventoryA.save();

  inventoryB.unitPrice = 100;
  try {
    await inventoryB.save();
    console.log('B saved ');
  } catch (err) {
    if (err.name === 'VersionError') {
      console.log('Optimistic lock');
    } else {
      console.error(err);
    }
  }

  await mongoose.disconnect();
}

runDemo();