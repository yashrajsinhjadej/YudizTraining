function errorHandler(err,req,res,next){
    // console.error(err.stack);
    res.status(err.status).send(err.message);
    next();
}

module.exports = {errorHandler} 