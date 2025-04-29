
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel')
const {responseHandler}= require("../utils/responseHandler")
const {Expense}=require('../models/expensModel');
const {Budget}= require('../models/budgetModel')
function generateToken(user){
    return jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}


async function createUser(req,res){
    try{

        const {username,email,password}=req.body;
        const alreadyexist = await User.findOne({email})
        console.log(alreadyexist)
    if(alreadyexist){
        responseHandler(res, { statusmsg: "OK", sMsg: 'user already exist', sData: {} });
    }
    else{
    
        const hashedpassword = bcrypt.hashSync(password,10)
         const newUser = await User.create({
            username,
            email,
            password: hashedpassword
        })
        const newBudget = await Budget.create({
            userId: newUser._id,
            nDailybudget: 0,
            nMonthlybudget: 0,
            nWeeklybudget: 0,
            dExpiryDate: new Date(Date.now() - 24*60*60*1000*31)  // setting - because it will allow user to update the budget        
        })
        const newExpense = await Expense.create({
           userId: newUser._id,
           nAmount: 0,
           aInventory: []
           
        }) 
    const token = generateToken(newUser)
    responseHandler(res, { statusmsg: "OK", sMsg: 'user created success', sData: { token } });
    }
}
catch(err){
    console.log(err)
    responseHandler(res,{ statusmsg: "OK", sMsg: 'Internal server error', sData: {} });
}
}

module.exports= {createUser}

