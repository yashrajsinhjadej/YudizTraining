const exp = require('constants');
const express = require('express');
const budget = require('./routes/budgets');
const expense = require('./routes/expense');
const {connectDb} = require('./db');
const user = require('./routes/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/health', (req, res) => {
    res.status(200).send({statusmsg:"OK",sMsg:'Server is running'})
})

app.use('/api/expenses',expense);


app.use('/api/budget',budget);

app.use('/api/user',user);

try{
connectDb();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
}
catch(err){
    console.log('server not started')
}
