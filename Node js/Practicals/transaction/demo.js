const mongoose = require('mongoose');
const {Customer} = require('./models/customer');
// require('dotenv').config();

async function transaction() {
    console.log("Connecting to MongoDB...",process.env.MONGODB_URI);
    await mongoose.connect("mongodb+srv://jadejayashrajsinh725:Yashraj2308@cluster0.45v3a2b.mongodb.net/bank");
    console.log("Connected to MongoDB");

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        await Customer.updateOne({ _id: 1 }, { $inc: { bal: 100 } }, { session });
        await Customer.updateOne({ _id: 2 }, { $inc: { bal: -100 } }, { session });
        // console.log(await Customer.find({},{session}))
        // throw new Error('custom error')
        await session.commitTransaction();  
        console.log("Transaction committed");
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
    } finally {
        session.endSession();
        await mongoose.connection.close();
    }
}
transaction();



// readpreference baki che  limit of server 
// slow query logs 

// optimistic lo

// break point karvanu 

//  read preference


