const  mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    sender_id: { type: Number, required: true },
    receiver_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    success: { type: Boolean, default: true },
});

module.exports = mongoose.model('Log', logSchema);



