const jwt = require('jsonwebtoken');
const { responseHandler } = require('../utils/responseHandler');
const { ReadFromFile } = require('../utils/fileoperation');



async function validatejwtadmin(req,res,next)
{
    const token = req.headers['authorization'];
    try{
        const decoded = jwt.verify(token,process.env.ADMIN_SECRET_KEY); 
        const admindata = await ReadFromFile(process.env.ADMIN_FILEPATH)
        const data = JSON.parse(admindata)
        const find = data.find((item)=>decoded.Email==item.Email)
        if(find){
            const check = find.loggeddevice.find(item=>item==token)
            if(check){
                next()
            }
            else{
                responseHandler(res,{statusmsg:"Unauthorized",sMsg:'this id was logged out'})    
            }
        }
        else{
            responseHandler(res,{statusmsg:"Unauthorized",sMsg:'you are not the admin'})
        }
    }
    catch(err){
        console.log(err)
        responseHandler(res, { statusmsg: "Unauthorized", sMsg: 'token is not valid ' });
    }
}




async function checkUsersjwt(req,res,next){
    const token = req.headers['authorization'];
    console.log(token)
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        const userdata = await ReadFromFile(process.env.USER_FILEPATH);
        const data = JSON.parse(userdata);

        const find = data.find((item)=> item.loggeddevice.includes(token))
        if(find){
            next()
        }
        else{
            responseHandler(res, { statusmsg: "Unauthorized", sMsg: 'your token is correct but not accepted' });
        }
    }
    catch(err){
        console.log(err)
        responseHandler(res, { statusmsg: "Unauthorized", sMsg: 'token is invalid ijbjihiutn' });
    }
}



module.exports = { validatejwtadmin,checkUsersjwt };