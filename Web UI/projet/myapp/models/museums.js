var pg = require('pg');
var config = require('../config'); // get our config file

var getAllMuseums = function(callback){
    pg.connect(config.conString, function(err, client, done) {
        if(err){
            return console.error('error connecting db', err);
        }
        client.query('SELECT * FROM t_museum', function(err, result){
            done();
            console.log(err);
            console.log(result);

            if(err){
                console.error('error running query', err);
            }
            callback(result.rows);
        });
    });
}

var getCollectionsByMuseum = function(museumId, callback){
    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_collection WHERE museum_id_museum=$1', [museumId], function(err, result){
            done();
            console.log(err);
            console.log(result.rows);

             if(err) {
                console.error('error running query', err);
            }
            callback(result.rows);
        });
    });
}

var getAllCollections = function(callback){
    pg.connect(config.conString, function(err, client, done) {
        if(err){
            return console.error('error connecting db', err);
        }
        client.query('SELECT * FROM t_collection', function(err, result){
            done();
            console.log(err);
            console.log(result);

            if(err){
                console.error('error running query', err);
            }
            callback(result.rows);
        });
    });
}

var getItemsByCollection = function(collectionId, callback){
    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_item WHERE collection_id_collection=$1', [collectionId], function(err, result){
            done();
            console.log(err);
            console.log(result);

             if(err) {
                console.error('error running query', err);
            }
            callback(result.rows);
        });
    });
}

var getAllItems = function(callback){
    pg.connect(config.conString, function(err, client, done) {
        if(err){
            return console.error('error connecting db', err);
        }
        client.query('SELECT * FROM t_item', function(err, result){
            done();
            console.log(err);
            //console.log(result);

            if(err){
                console.error('error running query', err);
            }
            callback(result.rows);
        });
    });
}

exports.getAllMuseums = getAllMuseums;
exports.getAllItems = getAllItems;
exports.getAllCollections = getAllCollections;
exports.getItemsByCollection = getItemsByCollection;
exports.getCollectionsByMuseum = getCollectionsByMuseum;