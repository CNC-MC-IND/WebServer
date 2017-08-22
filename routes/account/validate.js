var express = require('express');
var router = express.Router();
var jwt             = require("jsonwebtoken");
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

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
router.get('/', ensureAuthorized,function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query(configDB.query_getUserByToken + "'" +req.token+ "'", function (err, rows) {
            if (err)
                throw err;
            if(rows.length > 0){
                var user = rows[0]
                var prevUserTimestamp = user.timestamp;
                user.timestamp = fetch_unix_timestamp();

                connexion.query("UPDATE users SET timestamp = '" + user.timestamp + "' WHERE token = '" + req.token + "'", function(err1, result){
                    if(err1) throw err1;
                    if(result.affectedRows > 0){
                        res.json({
                            type: true,
                            data: user,
                            timestamp : prevUserTimestamp
                        });
                    } else {
                        res.json({
                            type: false,
                            data: "DB error"
                        });
                    }
                })

            } else {
                res.json({
                    type: false,
                    data: "Can't identify the timestamp"
                });
            }
            connexion.release();
        });
    })
});

module.exports = router;