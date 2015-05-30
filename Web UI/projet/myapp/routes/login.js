var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

//connexion
router.post('/login', function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  if (username == '' || password == '') {
    return res.send(401);
  }

  if (username != "valou" && password != "valou") {
    console.log("Attempt failed to login with " + user.username);
    return res.send(401);
  }

  var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });

  return res.json({token:token});
});

module.exports = router;