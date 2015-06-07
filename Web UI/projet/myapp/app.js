var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
//var pg = require('pg');
//var conString = "postgres://postgres:root@localhost/museumdb";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var config = require('./config'); // get our config file
/*** Chargement des models ***/
var modelUsers = require('./models/users');


/*** ROUTES ***/
//connexion
app.post('/login', function (req, res) {
  var mail = req.body.username || '';
  var password = req.body.password || '';

  if (mail == '' || password == '') {
    return res.send(401);
  }

  modelUsers.login(mail, password, function(data){
    console.log(data);
    if(data != undefined){
      var token = jwt.sign(data, config.secret, { expiresInMinutes: 60 });
      return res.json({code:'ok', token:token});
    } else {
      console.log("Echec du login avec " + mail);
      return res.json({code:'ko'});
    }
  });
});

app.get('/data.json', function(req, res) {
  res.sendFile(path.join(__dirname+'/data.json'));
});

//Route protégée grace a expressJwt token
/*app.get('/api/', expressJwt({secret: config.secret}), function(req, res) {
  res.sendFile(path.join(__dirname+'/data.json'));
});*/



app.get('/views/:page', function(req, res){
  res.sendFile(path.join(__dirname+'/views/'+req.params.page));
});

app.get('/public/:dossier/:page', function(req, res){
  res.sendFile(path.join(__dirname+'/public/'+req.params.dossier+'/'+req.params.page));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
