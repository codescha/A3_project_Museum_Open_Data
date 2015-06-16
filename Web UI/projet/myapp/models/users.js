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
        client.query('SELECT * FROM t_item INNER JOIN t_favorite ON t_favorite.item_id_item = t_item.id_item WHERE t_favorite.user_id_user = $1', [userId], function(err, result) {
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

exports.subscribe = subscribe;
exports.login = login;
exports.favorite = favorite;
exports.getFavorite = getFavorite;
exports.getFavorites = getFavorites;