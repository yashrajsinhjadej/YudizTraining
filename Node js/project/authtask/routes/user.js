const express = require('express');
const router = express.Router();
const {checkEmail,Result}=require('../middleware/expressvalidator');
const {validatejwt,checkUsersjwt}=require('../middleware/jwtvalidator')
const {userlogin,getCarDetails,logoutuser,SendOTP}=require('../controller/user')



router.get('/', (req, res) => {
    res.send('Hello from user')
})

router.post('/sendotp',checkEmail,Result,SendOTP)
router.post('/login',checkEmail,Result,userlogin)


router.get('/getcardetails',checkUsersjwt,getCarDetails)


router.get('/logout',checkUsersjwt,logoutuser)
module.exports=router



