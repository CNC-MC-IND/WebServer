var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const config = require('./config');
const configDB = require('./configDB');
var mysql = require('mysql');
var toolBox = require('./models/toolBox');
var pushScheduler = require('./models/pushScheduler');


var index = require('./routes/index');
var main = require('./routes/main');
var establish = require('./routes/establish');
var admin_users = require('./routes/admin/users');
var admin_approve = require('./routes/admin/approve');
var admin_instantQuery = require('./routes/admin/instantQuery');
var admin_signupList = require('./routes/admin/signupList');
var account_cert = require('./routes/account/cert');
var account_signup = require('./routes/account/signup');
var account_validate = require('./routes/account/validate');
var account_reset = require('./routes/account/reset');
var video_upload = require('./routes/video/upload');
var video_list = require('./routes/video/list');
var video_remove = require('./routes/video/remove');
var video_streaming = require('./routes/video/streaming');
var video_downstream = require('./routes/video/downstream');
var video_getInterval = require('./routes/video/getInterval');
var video_setInterval = require('./routes/video/setInterval');
var data_renewedData = require('./routes/data/renewedData');
var data_insert = require('./routes/data/insert');
var fcm_compare = require('./routes/FCM/compare');
var fcm_register = require('./routes/FCM/register');
var fcm_unregister = require('./routes/FCM/unregister');

var app = express();

// DB set
//mongoose.connect(config.mongodbUri);
var mysqlConnexion = mysql.createPool(configDB);
mysqlConnexion.getConnection(function (err) {
    if(err)
        throw err;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('jwt-secret', config.secret);
app.set('organization', config.organization);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', parameterLimit: 1000000}));
app.use(function(req, res, next) {
    //모든 도메인의 요청을 허용하지 않으면 웹브라우저에서 CORS 에러를 발생시킨다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use('/', index);
app.use('/main', main)
app.use('/establish', establish);
app.use('/admin/users', admin_users);
app.use('/admin/instant_query', admin_instantQuery);
app.use('/admin/approve', admin_approve);
app.use('/admin/signupList', admin_signupList);
app.use('/account/cert', account_cert);
app.use('/account/signup', account_signup);
app.use('/account/validate', account_validate);
app.use('/account/reset', account_reset);
app.use('/video/upload', video_upload);
app.use('/video/list', video_list);
app.use('/video/remove', video_remove);
app.use('/video/streaming/*', video_streaming);
app.use('/video/downstream/*', video_downstream);
app.use('/video/get_interval', video_getInterval);
app.use('/video/set_interval', video_setInterval);
app.use('/data/renewed_data', data_renewedData);
app.use('/data/insert', data_insert);
app.use('/fcm/compare', fcm_compare);
app.use('/fcm/register', fcm_register);
app.use('/fcm/unregister', fcm_unregister);

pushScheduler.start();

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
