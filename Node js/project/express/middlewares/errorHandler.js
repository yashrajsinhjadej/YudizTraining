function errorHandler(err, req, res, next) {
    // console.log(err)
    const statusCode = err.status || 500; // defaulet 500
    const message = statusCode === 500 ? 'Internal server error' : err.message;
    res.status(statusCode).send({ error: message }); 
    console.log(err)
}

module.exports = { errorHandler };