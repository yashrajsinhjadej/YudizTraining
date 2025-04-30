const {responseHandler} = require("../utils/responseHandler")
const {Expense} = require('../models/expensModel');
const {Budget} = require('../models/budgetModel')
const {Inventory} = require('../models/inventoryModel'); 
// const { Expense } = require("../models/expensModel");

async function getExpenses(req,res){
    try{
        const userId = req.userId
        const expenses = await Expense.find({userId})
        if(expenses){
            responseHandler(res, { statusmsg: "OK", sMsg: 'Expenses fetched successfully', sData: {expenses} });
        }
        else{
            responseHandler(res, { statusmsg: "OK", sMsg: 'No expenses found', sData: {} });
        }
    }
    catch(err){
        console.log(err)
        responseHandler(res,{ statusmsg: "OK", sMsg: 'Internal server error', sData: {} });
    }

}

async function createExpenes(req, res) {
    try {
        const userId = req.userId;
        const { aItems } = req.body;
        let amount;

        for (let i = 0; i < aItems.length; i++) {
            const item = await Inventory.findById(aItems[i].Item_id);
            if (!item) {
                return responseHandler(res, { statusmsg: "OK", sMsg: 'Item not found', sData: {} });
            }
            if (item.nQuantity < aItems[i].nQuantity) {
                return responseHandler(res, { statusmsg: "OK", sMsg: 'Not enough quantity', sData: {} });
            }
            amount = aItems[i].nQuantity * item.unitPrice; // Calculating the total amount
        }

        const expense = await Expense.findOne({ userId });
        const aInventory = expense.aInventory;

        const budget = await Budget.findOne({ userId });
        const dailybudget = budget.nDailybudget;
        const weeklybudget = budget.nWeeklybudget;
        const monthlybudget = budget.nMonthlybudget;

        const today = new Date();

        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0); // Start of today
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999); // End of today

    
        const filterByDate = aInventory.filter((item) => {
            const purchaseDate = new Date(item.dpurchaseDate); 
            return purchaseDate >= startOfToday && purchaseDate <= endOfToday;
        });

        console.log(filterByDate, 'filterByDate');


        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); 
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() - today.getDay() + 7); 
        endOfWeek.setHours(23, 59, 59, 999); 

        console.log(startOfWeek, 'startOfWeek');
        console.log(endOfWeek, 'endOfWeek');

        // Filter aInventory purchased this week
        const filterByWeek = aInventory.filter((item) => {
            const purchaseDate = new Date(item.dpurchaseDate); 
            return purchaseDate >= startOfWeek && purchaseDate <= endOfWeek;
        });

        console.log(filterByWeek, 'filterByWeek'); 

        // start and end of the month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0); // Start of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // End of the month

        console.log(startOfMonth, 'startmonth');
        console.log(endOfMonth, 'endmonth'); 

        const filterByMonth = aInventory.filter((item) => {
            const purchaseDate = new Date(item.dpurchaseDate);
            return purchaseDate >= startOfMonth && purchaseDate <= endOfMonth;
        });

        //calculate the daily spent 
        
        let dailyspent= 0
        for(let i=0 ; i<filterByDate.length; i++){
            const item  = await Inventory.findById(filterByDate[i].iInventoryId);
            dailyspent += item.unitPrice * filterByDate[i].nQuantity;
        }
        console.log(dailyspent, 'dailyspent')

        // calculate weeky spent 
        let weeklyspent= 0
        for(let i=0;i<filterByWeek.length; i++){
            const item  = await Inventory.findById(filterByWeek[i].iInventoryId);
            weeklyspent += item.unitPrice * filterByWeek[i].nQuantity;
        }
        console.log(weeklyspent, 'weeklyspent')

        //calculate monthly spent
        let monthlyspent= 0
        for(let i=0;i<filterByMonth.length; i++){
            const item  = await Inventory.findById(filterByMonth[i].iInventoryId);
            monthlyspent += item.unitPrice * filterByMonth[i].nQuantity;
        }
        console.log(monthlyspent, 'monthlyspent')



        //checking this spends 
        if(monthlybudget < monthlyspent + amount || weeklybudget < weeklyspent + amount || dailybudget < dailyspent + amount){
            return responseHandler(res, { statusmsg: "OK", sMsg: 'budget exceeded', sData: {} });
        }
        else{

            
            const newInventoryItems = []
            for (let i = 0; i < aItems.length; i++) {
                const newInventory = {
                    iInventoryId: aItems[i].Item_id,
                    nQuantity: aItems[i].nQuantity,
                    dpurchaseDate: new Date(),
                };
                newInventoryItems.push(newInventory);
            }
         aInventory.push(...newInventoryItems);  
         const updatedExpense = await Expense.findOneAndUpdate({ userId },{ aInventory});

        //updating the inventory 
        for(let i=0;i<aItems.length; i++){
            const item = await Inventory.findById(aItems[i].Item_id);
            if (!item) {
                return responseHandler(res, { statusmsg: "OK", sMsg: 'Item not found', sData: {} });
            }
            item.nQuantity -= aItems[i].nQuantity;
            await item.save();
        }


         return responseHandler(res, { statusmsg: "OK", sMsg: 'Expense created successfully', sData: { updatedExpense } });
        }
    } catch (err) {
        console.log(err);
        responseHandler(res, { statusmsg: "OK", sMsg: 'Internal server error', sData: {} });
    }
}

module.exports = {getExpenses,createExpenes}


