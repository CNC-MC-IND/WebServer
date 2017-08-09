var express = require('express');
var router = express.Router();
var User     = require('../models/User');
var jwt             = require("jsonwebtoken");
function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        if(bearer.length > 1){
            bearerToken = bearer[1];
        } else {
            bearerToken = bearer[0];
        }
        const secret = req.app.get('jwt-secret');
        jwt.verify(bearerToken, secret, function (err) {
            if(err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                req.token = bearerToken;
                next(); // 다음 콜백함수 진행
            }
        });
    } else {
        res.json({
            type: false,
            data: "can't find token in your request"
        });
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});

fetch_unix_timestamp = function()
{
    return Math.floor(new Date().getTime() / 1000);
}


/* GET verifying user. */
router.get('/',ensureAuthorized, function(req, res, next) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            var prevUserTimestamp = user.timestamp;
            user.timestamp = fetch_unix_timestamp();
            user.save(function(err){
                if(err){
                    res.json({
                        type: false,
                        data: "Can't identify the timestamp"
                    });
                } else {
                    user.timestamp = prevUserTimestamp;
                    res.json({
                        type: true,
                        data: user,
                        timestamp : user.timestamp
                    });
                }
            });



        }
    });
});

module.exports = router;