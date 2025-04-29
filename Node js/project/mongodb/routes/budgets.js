const router = require('express').Router();
const {verifyToken}=require('../middleware/verifyjwt');
const {createBudget,getBudgets} = require('../controller/budget');
const {validateReq,aBudgetData}= require('../middleware/validate')



router.get('/',verifyToken,(req, res) => {
    getBudgets(req, res)
})

router.post('/',aBudgetData,validateReq,verifyToken, (req, res) => {
    createBudget(req, res)
})

module.exports = router;