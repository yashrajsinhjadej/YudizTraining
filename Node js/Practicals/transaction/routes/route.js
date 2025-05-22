const router = require('express').Router();
const {transact} = require('../controllers/transact');

router.post('/',async (req,res)=>{
    transact(req,res);
})


module.exports = router;