var pg = require('pg');
var config = require('../config'); // get our config file
var sha1 = require('sha1');

var login = function(mail, password, callback){
    var hashedPassword = sha1(password);

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_user WHERE mail=$1 AND password=$2', [mail, hashedPassword], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query', err);
            }
            callback(result.rows[0]);
        });
    });
}

var checkMail = function(mail, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_user WHERE mail=$1', [mail], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query', err);
            }
            callback(result.rows[0]);
        });
    });
}

var subscribe = function(firstname, lastname, mail, password, callback){
    var hashedPassword = sha1(password);

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO t_user (firstname, lastname, mail, password) VALUES ($1, $2, $3, $4)', [firstname, lastname, mail, hashedPassword], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rowCount);
        });
    });
}

var getUser = function(id){
    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_user WHERE id_user=$1 ', [userId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rows[0]);
        });
    });
}

var favorite = function(userId, itemId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO t_favorite (item_id_item, user_id_user) VALUES ($1, $2)', [itemId, userId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rowCount);
        });
    });
}

//Vérifie la présence de l'objet dans la table des favoris
var getFavorite = function(userId, itemId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_favorite WHERE item_id_item=$1 AND user_id_user=$2', [itemId, userId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rows[0]);
        });
    });
}

var getFavorites = function(userId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT t_item.id_item, t_item.title, t_item.description FROM t_item INNER JOIN t_favorite ON t_favorite.item_id_item = t_item.id_item WHERE t_favorite.user_id_user = $1', [userId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result);
        });
    });
}

var createExhibition = function(title, description, userId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO t_exhibitions (title, description, user_id_user) VALUES ($1, $2, $3)', [title, description, userId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result);
        });
    });
}

var exhibitionList = function(userId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        if(userId == "all"){
            client.query('SELECT * FROM t_exhibitions INNER JOIN t_user ON t_user.id_user = t_exhibitions.user_id_user ORDER BY t_user.id_user', function(err, result) {
                //call `done()` to release the client back to the pool
                done();
                console.log(err);
                console.log(result);
                if(err) {
                    console.error('error running query', err);
                }
                callback(result);
            });
        } else {
            client.query('SELECT * FROM t_exhibitions WHERE user_id_user = $1', [userId], function(err, result) {
                //call `done()` to release the client back to the pool
                done();
                console.log(err);
                console.log(result);
                if(err) {
                    console.error('error running query', err);
                }
                callback(result);
            });
        }
    });
}

var fillExhibition = function(exhibitionId, itemId, callback) {

    pg.connect(config.conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO t_item_exhibition (item_id_item, exhibition_id_exhibition) VALUES ($1, $2)', [itemId, exhibitionId], function (err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if (err) {
                console.error('error running query', err);
            }
            callback(result);
        });
    });
}


    var objectsInExhibition = function(exhibitionId, callback){

        pg.connect(config.conString, function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('SELECT t_item.id_item, t_item.title, t_item.description, t_exhibitions.title AS exhibitionTitle FROM t_item INNER JOIN t_item_exhibition ON t_item_exhibition.item_id_item = t_item.id_item INNER JOIN t_exhibitions ON t_exhibitions.id_exhibition = t_item_exhibition.exhibition_id_exhibition WHERE t_item_exhibition.exhibition_id_exhibition = $1', [exhibitionId], function(err, result) {
                //call `done()` to release the client back to the pool
                done();
                console.log(err);
                console.log(result);
                if(err) {
                    console.error('error running query', err);
                }
                callback(result);
            });
        });
    }

var deleteFavorite = function(userId, itemId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('DELETE FROM t_favorite WHERE user_id_user=$1 AND item_id_item=$2', [userId, itemId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rowCount);
        });
    });
}

var deleteExhibition = function(userId, exhibitionId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('DELETE FROM t_exhibitions WHERE user_id_user=$1 AND id_exhibition=$2', [userId, exhibitionId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rowCount);
        });
    });
}

var deleteExhibitionItem = function(exhibitionId, itemId, callback){

    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('DELETE FROM t_item_exhibition WHERE exhibition_id_exhibition=$1 AND item_id_item=$2', [exhibitionId, itemId], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            console.log(err);
            console.log(result);
            if(err) {
                console.error('error running query', err);
            }
            callback(result.rowCount);
        });
    });
}

exports.subscribe = subscribe;
exports.login = login;
exports.favorite = favorite;
exports.getFavorite = getFavorite;
exports.getFavorites = getFavorites;
exports.checkMail = checkMail;
exports.createExhibition = createExhibition;
exports.exhibitionList = exhibitionList;
exports.fillExhibition = fillExhibition;
exports.objectsInExhibition = objectsInExhibition;
exports.deleteFavorite = deleteFavorite;
exports.deleteExhibitionItem = deleteExhibitionItem;
exports.deleteExhibition = deleteExhibition;
