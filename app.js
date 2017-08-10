var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const config = require('./config');
const configDB = require('./configDB');
var morgan       = require("morgan");
var mongoose  = require("mongoose");
var mysql = require('mysql');

var index = require('./routes/index');
var establish = require('./routes/establish');
var users = require('./routes/users');
var authenticate = require('./routes/authenticate');
var signin = require('./routes/signin');
var me = require('./routes/me');
var approve = require('./routes/approve');
var reset = require('./routes/reset');
var videoUpload = require('./routes/video_upload');

var app = express();

// DB set
mongoose.connect(config.mongodbUri);
var mysqlConnexion = mysql.createPool(configDB);
mysqlConnexion.getConnection(function (err) {
    if(err)
        throw err;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('jwt-secret', config.secret);
app.set('md5-salt', config.salt);
app.set('organization', config.organization);
app.use(function(req, res, next) {
    //모든 도메인의 요청을 허용하지 않으면 웹브라우저에서 CORS 에러를 발생시킨다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use('/', index);
app.use('/establish', establish);
app.use('/users', users);
app.use('/authenticate', authenticate);
app.use('/approve', approve);
app.use('/signin', signin);
app.use('/me', me);
app.use('/reset', reset);
app.use('/video_upload', videoUpload);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error : ' + err.message);
});

module.exports = app;
