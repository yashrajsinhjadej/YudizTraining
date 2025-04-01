const express = require('express');
const route = require('./routes/route')
const {errorHandler} = require('./middlewares/errorHandler.js')
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/health', (req, res) => {
    res.status(200).send({statusmsg:"OK",sMsg:'Server is running'})
})
app.use('/',express.static('public'))

app.use('/api/data',route); // using the route handler for /api/data
app.use('/api/public',express.static('public'))
app.use(errorHandler);

module.exports = app;
