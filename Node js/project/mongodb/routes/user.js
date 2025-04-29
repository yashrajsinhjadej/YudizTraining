const router = require('express').Router();
const {createUser} = require('../controller/user');
const {loginValidation,validateReq} = require('../middleware/validate')


router.post('/',loginValidation,validateReq,(req, res) => {
    createUser(req, res)
})


module.exports= router;