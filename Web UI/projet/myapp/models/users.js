var pg = require('pg');
var config = require('../config'); // get our config file

var login = function(mail, password, callback){
    pg.connect(config.conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM t_user WHERE mail=$1 AND password=$2', [mail, password], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query', err);
            }
            callback(result.rows[0]);
        });
    });
}

exports.login = login;
