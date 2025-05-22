const express = require('express');
const route = require('./routes/route');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/health', (req, res) => {
    res.status(200).send({statusmsg:"OK",sMsg:'Server is running'})
})

app.use('/transaction',route);

mongoose.connect("mongodb+srv://jadejayashrajsinh725:Yashraj2308@cluster0.45v3a2b.mongodb.net/bank")
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port', 3000);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

