const express = require('express');
const router = express.Router();
const {checkEmail,Result,checkpassword,checkcardetails,checkuuid }=require('../middleware/expressvalidator');
const {login,logout,addcar, updatecar,deletecar}=require('../controller/admin')
const {validatejwtadmin}=require('../middleware/jwtvalidator')

router.get('/', (req, res) => {
    res.send('Hello from admin')
})

router.get('/logout',validatejwtadmin,logout)

router.post('/login',checkEmail,checkpassword,Result,login)

router.post('/addcar',validatejwtadmin,checkcardetails,Result,addcar)

router.put('/updatecar/:id',validatejwtadmin,checkcardetails,checkuuid,Result,updatecar)


router.delete('/deletecar/:id',validatejwtadmin,checkuuid,Result,deletecar)




module.exports=router