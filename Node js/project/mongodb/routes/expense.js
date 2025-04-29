const router = require('express').Router();
const {verifyToken}=require('../middleware/verifyjwt');
const {getExpenses,createExpenes} = require('../controller/expense');

router.get('/',verifyToken,(req, res) => {
    getExpenses(req, res)
})


router.post('/',verifyToken,(req, res) => {
    createExpenes(req, res)
})

module.exports = router;