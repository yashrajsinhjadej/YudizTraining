


function responseHandler(res,statuscode,msg){
    res.status(statuscode).send(msg)
}

module.exports = {responseHandler}