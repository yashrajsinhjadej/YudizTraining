var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var route = require('./routes/route')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { error } = require('console');
var {errorHandler} = require('./middlewares/errorHandler.js')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',express.static('public'))
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/api/public',public) //using route for handling public files as well 
app.use('/api/data',route); // Use the route handler for /api/data
app.use('/api/public',express.static('public'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.use(errorHandler);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
