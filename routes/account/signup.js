var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

fetch_unix_timestamp = function()
{
    return Math.floor(new Date().getTime() / 1000);
}
// '/' change '/signup'
router.post('/',function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query(configDB.query_getUserByEmail + "'" +req.body.email+ "'", function (err, rows) {
            if (err)
                throw err;
            if(rows.length > 0){
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var email = req.body.email
                var name = req.body.name
                var organization = req.body.organization
                var timestamp = fetch_unix_timestamp()
                var password = req.body.password
                var salt = bcrypt.genSaltSync(12);
                password = bcrypt.hashSync(password,salt)
                var token = '-'
                var fcm = '-'
                                
                if(email == undefined || password == undefined || organization == undefined || name == undefined) {
                    res.json({
                        type: false,
                        data: "Invalid input"
                    });
                    return;
                }
                connexion.query("INSERT INTO users (email, name, organization, timestamp, password, token, fcm) VALUES ('"+email+"', '"+name+"', '"+organization+"', "+timestamp+", '"+password+"', '"+token+"', '"+fcm+"')", function (err1, result) {
                    if(err1) throw err1
                    if(result.affectedRows > 0){
                        res.json({
                            type: true,
                            data: email,
                        })
                    }
                })
            }
            connexion.release();
        });
    })
});

module.exports = router;
