const router = require('express').Router();
const {transaction} = require('../controllers/transact');

router.post('/',async (req,res)=>{
    transaction(req,res);
})


module.exports = router;