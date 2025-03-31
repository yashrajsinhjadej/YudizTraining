function errorHandler(err,req,res,next){
    // console.error(err.stack);
    res.status(err.status).send(err.message);
    console.log('err handler')
    next();
}

module.exports = {errorHandler} 