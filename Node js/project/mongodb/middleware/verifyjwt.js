const jwt = require('jsonwebtoken');

const {responseHandler}= require("../utils/responseHandler")



function verifyToken(req,res,next){
    const token = req.headers['authorization']?.split(' ')[1]
    if(!token){
        return responseHandler(res,{ statusmsg: "OK", sMsg: 'Token not found', sData: {} });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return responseHandler(res,{ statusmsg: "OK", sMsg: 'Invalid token', sData: {} });
        }
        req.userId = decoded.userId;
        next();
    });
}


module.exports={verifyToken}