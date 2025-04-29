const {responseHandler} = require("../utils/responseHandler")
const {Expense} = require('../models/expensModel');
const {Budget} = require('../models/budgetModel')
const {Inventory} = require('../models/inventoryModel'); 
// const { Expense } = require("../models/expensModel");

async function getExpenses(req,res){
    responseHandler(res, { statusmsg: "OK", sMsg: 'Expenses fetched successfully', sData: {} });

}

async function createExpenes(req,res){

    try
    {
        const userId = req.userId
        const {aItems}=req.body
        let amount = 0
        for (let i=0;i<aItems.length;i++){
            const item = await Inventory.findById(aItems[i].Item_id)
            if(!item){
                return responseHandler(res, { statusmsg: "OK", sMsg: 'Item not found', sData: {} });
            }
            if(item.nQuantity < aItems[i].nQuantity){
                return responseHandler(res, { statusmsg: "OK", sMsg: 'Not enough quantity', sData: {} });
            }
         amount = aItems[i].nQuantity * item.unitPrice //calculating the total amount 
        }
        console.log(amount)
        const expense = await Expense.findOne({userId})
        const budget = await Budget.findOne({userId})
        console.log(budget)
        console.log(expense)
        const dailybudget = budget.nDailybudget
        const weeklybudget = budget.nWeeklybudget
        const monthlybudget = budget.nMonthlybudget
        
        const products = expense.aInventory
        console.log(products)        
        responseHandler(res, { statusmsg: "OK", sMsg: 'Expenses created successfully', sData: {} });
    

    }
    catch(err){
        console.log(err)
        responseHandler(res,{ statusmsg: "OK", sMsg: 'Internal server error', sData: {} });
    }
}

module.exports = {getExpenses,createExpenes} 


