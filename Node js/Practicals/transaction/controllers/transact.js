const mongoose = require('mongoose');
const {Customer} = require('../models/customer');
const Log = require('../models/logs');


async function transaction(req,res){    

const session = await mongoose.startSession();

const {sender_id, receiver_id, amount} = req.body;
    try {
        session.startTransaction();

        await Customer.updateOne({ _id: sender_id }, { $inc: { bal: -amount } }, { session });
        await Customer.updateOne({ _id: receiver_id}, { $inc: { bal: amount } }, { session });
       
        // console.log(await Customer.find())
        await session.commitTransaction();  
        await Log.create([{ sender_id, receiver_id, amount,success:true}], { session });
        console.log("Transaction committed");
        res.send('transaction success');
    } catch (err) {
        console.log(err);
        await Log.create([{ sender_id, receiver_id, amount,success:false}], { session });
        res.status(500).send('transaction failed');
        await session.abortTransaction();
    } finally {
        session.endSession();
    }

}


async function createuser(req,res){
    const {_id,name, bal} = req.body;
    const user = new Customer({_id,name, bal});
    await user.save();
    res.send(user);
}



module.exports = {
    transaction,createuser
}