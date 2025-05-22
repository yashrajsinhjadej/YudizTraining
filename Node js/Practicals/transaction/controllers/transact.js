const mongoose = require('mongoose');
const {Customer} = require('../models/customer');

async function transaction(req,res){    

const session = await mongoose.startSession();

const {sender_id, receiver_id, amount} = req.body;
    try {
        session.startTransaction();

        await Customer.updateOne({ _id: sender_id }, { $inc: { bal: -amount } }, { session });
        await Customer.updateOne({ _id: receiver_id}, { $inc: { bal: amount } }, { session });
        
        console.log(await Customer.find())
        await session.commitTransaction();  
        console.log("Transaction committed");
        res.send('transaction success');
    } catch (err) {
        console.log(err);
        res.status(500).send('transaction failed');
        await session.abortTransaction();
    } finally {
        session.endSession();
    }

}

module.exports = {
    transaction
}