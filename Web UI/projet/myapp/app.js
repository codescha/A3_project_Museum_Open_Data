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

            modelUsers.login(mail, password, function (data) {
                console.log(data);
                if (data != undefined) {
                    var token = jwt.sign(data, config.secret, {expiresInMinutes: 60});
                    return res.json({code: 'ok', token: token, user: data});
                    //return data;
                } else {
                    console.log("Echec du login avec " + mail);
                    return res.json({code: 'ko'});
                }
            });

});

app.post('/subscribe', function (req, res) {
  var firstname = req.body.firstname || '';
  var lastname = req.body.lastname || '';
  var email = req.body.email || '';
  var password = req.body.password || '';

  if (email == '' || password == '' || firstname == '' || lastname == '') {
    return res.send(401);
  }

    modelUsers.checkMail(email, function(data) {
        if (data != undefined) {
            console.log("L'email " + email + "existe déjà");
            return res.json({code: 'exists'});
        } else {
            modelUsers.subscribe(firstname, lastname, email, password, function (data) {
                if (data != undefined) {
                    return res.json({code: 'ok'});
                } else {
                    return res.json({code: 'ko'});
                }
            });
        }
    });
});

app.post('/objects', function (req, res) {
    var userId = req.body.userId;
    var itemId = req.body.itemId;

    if (userId == '' || itemId == '' ) {
        return res.send(401);
    }

    modelUsers.getFavorite(userId, itemId, function(data){
        console.log(data);
        if (data != undefined) {
            console.log("L'objet " + itemId +  " est déjà ajouté aux favoris");
            return res.json({code:'exists'});
        } else {
            modelUsers.favorite(userId, itemId, function(data){
                console.log(data);
                if(data != undefined){
                    return res.json({code:'ok'});
                } else {
                    return res.json({code:'ko'});
                }
            })
        }
    });
});

app.post('/favorites', function (req, res) {
    var userId = req.body.userId || '';

    if (userId == '') {
        return res.send(401);
    }

    modelUsers.getFavorites(userId, function(data) {
        if (data != null) {
            return res.json({code: 'ok', favorites:data.rows});
            console.log(data.rows);
        } else {
            console.log("Echec");
            return res.json({code: 'ko'});
        }
    });

});

app.post('/deleteFavorite', function (req, res) {
    var userId = req.body.userId;
    var itemId = req.body.itemId;

    if (userId == '' || itemId == '' ) {
        return res.send(401);
    }

    modelUsers.deleteFavorite(userId, itemId, function(data){
        console.log(data);
        if (data != undefined) {
            return res.json({code:'ok'});
        } else {
            return res.json({code:'ko'});
        }
    });

});

app.post('/deleteExhibition', function (req, res) {
    var userId = req.body.userId;
    var exhibitionId = req.body.exhibitionId;

    if (userId == '' || exhibitionId == '' ) {
        return res.send(401);
    }

    modelUsers.deleteExhibition(userId, exhibitionId, function(data){
        console.log(data);
        if (data != undefined) {
            return res.json({code:'ok'});
        } else {
            return res.json({code:'ko'});
        }
    });

});

app.post('/deleteExhibitionItem', function (req, res) {
    var exhibitionId = req.body.exhibitionId;
    var itemId = req.body.itemId;

    if (exhibitionId == '' || itemId == '' ) {
        return res.send(401);
    }

    modelUsers.deleteExhibitionItem(exhibitionId, itemId, function(data){
        console.log(data);
        if (data != undefined) {
            return res.json({code:'ok'});
        } else {
            return res.json({code:'ko'});
        }
    });

});

app.post('/createExhibition', function (req, res) {
    var title = req.body.title || '';
    var description = req.body.description || '';
    var userId = req.body.userId || '';

    if (title == '' || description == '' || userId =='') {
        return res.send(401);
    }

    modelUsers.createExhibition(title, description, userId, function (data) {
        console.log(data);
        if (data != undefined) {
            return res.json({code: 'ok'});
        } else {
            console.log("Echec");
            return res.json({code: 'ko'});
        }
    });

});

app.post('/exhibitionList', function (req, res) {
    var userId = req.body.userId || '';

    if (userId =='') {
        return res.send(401);
    }

    modelUsers.exhibitionList(userId, function (data) {
        console.log(data);
        if (data != undefined) {
            return res.json({code: 'ok', exhibition:data.rows});
            console.log(data.rows);
        } else {
            console.log("Echec");
            return res.json({code: 'ko'});
        }
    });

});

app.post('/fillExhibition', function (req, res) {
    var exhibitionId = req.body.exhibitionId || '';
    var itemId = req.body.itemId || '';

    if (exhibitionId =='' || itemId == '') {
        return res.send(401);
    }

    modelUsers.checkItemInExhibition(itemId, exhibitionId, function(data){
        console.log(data);
        if (data != undefined) {
            console.log("L'objet " + itemId +  " est déjà ajouté à cette exposition");
            return res.json({code:'exists'});
        } else {
            modelUsers.fillExhibition(exhibitionId, itemId, function (data) {
            console.log(data);
            if (data != undefined) {
                return res.json({code: 'ok'});
            } else {
                console.log("Echec");
                return res.json({code: 'ko'});
            }
        });
        }
    });



});

app.post('/objectsInExhibition', function (req, res) {
    var exhibitionId = req.body.exhibition_id || '';

    console.log("ID EXPO" + exhibitionId);

    if (exhibitionId == '') {
        return res.sendStatus(401);
    }

    modelUsers.objectsInExhibition(exhibitionId, function (data) {
        console.log(data);
        if (data != undefined) {
            return res.json({code: 'ok', objects:data.rows});
            console.log(data);
        } else {
            console.log("Echec");
            return res.json({code: 'ko'});
        }
    });

});

app.get('/allExhibitions', function (req, res) {
    modelUsers.exhibitionList("all", function (data) {
        console.log(data);
        if (data != undefined) {
            return res.json({code: 'ok', exhibitions:data.rows});
            console.log(data.rows);
        } else {
            console.log("Echec");
            return res.json({code: 'ko'});
        }
    });
});

app.get('/json/:file', function(req, res) {
  res.sendFile(path.join(__dirname+'/json/'+req.params.file));
});

//Route protégée grace a expressJwt token
/*app.get('/api/', expressJwt({secret: config.secret}), function(req, res) {
  res.sendFile(path.join(__dirname+'/data.json'));
});*/



app.get('/views/:page', function(req, res){
  res.sendFile(path.join(__dirname+'/views/'+req.params.page));
});

app.get('/public/fonts/fontawesome-webfont.ttf?v=4.2.0', function(req, res){
    res.sendFile(path.join(__dirname+'/public/fonts/fontawesome-webfont.ttf?v=4.2.0'));
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
