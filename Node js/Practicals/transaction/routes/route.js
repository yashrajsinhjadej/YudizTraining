const router = require('express').Router();
const {transaction,createuser} = require('../controllers/transact');

router.post('/',async (req,res)=>{
    transaction(req,res);
})

router.post('/createuser',async (req,res)=>{
   createuser(req,res);
})

module.exports = router;