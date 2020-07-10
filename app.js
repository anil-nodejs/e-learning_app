var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var logger = require('morgan');
//new added module
var expbhs = require('express-handlebars');
var bodyParser = require('body-parser')
const expressValidator = require('express-validator')
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local'), Strategy;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//database
const db = require('./config/database').mongoDB_URL;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log("Mongodb is not connected");
  }
  else {
    console.log("Mongo db is connected");
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('views'))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//Express validaor
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var nameSpace = param.split('.'), root = nameSpace.shift(), formParam = root;
    while (nameSpace.length) {
      formParam += '[' + nameSpace.shift() + ']';
    }
    return { params: formParam, msg: msg, value: value }
  }
}))

//connect flash
app.use(flash());

//Globle vars
app.use((req, res, next) => {
  res.locals.message = require('express-messages')(req, res);
  next();
});

// Route path
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
