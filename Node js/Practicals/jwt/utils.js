const jwt  = require('jsonwebtoken')
const data = []

function jwdvalidate(req,res,next)
{
    try{
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token,'Yashrajsinh-Jadeja')
        req.token=token
        next()
    }
    catch(err){
        res.send('not valid');
    }
}

module.exports={data,jwdvalidate}