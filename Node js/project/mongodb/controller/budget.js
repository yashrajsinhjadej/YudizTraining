const {responseHandler}= require("../utils/responseHandler")
const {Budget} = require('../models/budgetModel');
const {Users} = require('../models/userModel');


async function createBudget(req,res){
    try{
        const userId = req.userId
        const {nDailybudget,nMonthlybudget,nWeeklybudget} = req.body
        const alreadyexist = await Budget.findOne({userId})
        if(!alreadyexist){
            const newBudget = await Budget.create({
                userId,
                nDailybudget,
                nMonthlybudget,
                nWeeklybudget
            })
            responseHandler(res, { statusmsg: "OK", sMsg: 'updated', sData: {newBudget} });
        }
        else{
            if(alreadyexist.dExpiryDate < new Date()){
                const newBudget = await Budget.updateOne({userId},{
                    nDailybudget,
                    nMonthlybudget,
                    nWeeklybudget,
                    dExpiryDate: new Date(Date.now() + 24*60*60*1000*31)
                })
                responseHandler(res, { statusmsg: "OK", sMsg: 'Budget updated success ', sData: {newBudget} });
             }
             else{
                responseHandler(res, { statusmsg: "InternalServerError", sMsg: 'try again after some time', sData: {} });
             }   
    }}
    catch(err){
        console.log(err)
        responseHandler(res,{ statusmsg: "OK", sMsg: 'Internal server error', sData: {} });
    }
}


async function getBudgets(req,res){
   try{
        const userId = req.userId 
        const budgets = await Budget.find({})
        if(budgets.length>0){
            responseHandler(res, { statusmsg: "OK", sMsg: 'Budgets fetched successfully', sData: {budgets} });
        }
        else{
            responseHandler(res, { statusmsg: "OK", sMsg: 'No budgets found', sData: {} });
        }
   }
   catch(err){
    console.log(err)
    responseHandler(res,{ statusmsg: "OK", sMsg: 'Internal server error', sData: {} });
   }
}


module.exports= {createBudget,getBudgets}