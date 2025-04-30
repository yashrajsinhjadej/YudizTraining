const { param,body,validationResult }=require("express-validator");
const mongoose=require('mongoose')


const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
]


const aBudgetData=[
    body('nDailybudget').notEmpty().withMessage('daily limit is required !').bail().isNumeric().withMessage('Daily limit must be a number').bail(),
    body('nMonthlybudget').notEmpty().withMessage('monthly limit is required !').bail().isNumeric().withMessage('monthly limit must be a number').bail(),
    body('nWeeklybudget').notEmpty().withMessage('weekly limit is required !').bail().isNumeric().withMessage('weekly limit must be a number').bail(), 
]

function validateReq(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({massage : errors.array()});
    }
    next();
}


module.exports = {
    loginValidation,
    validateReq,
    aBudgetData
}