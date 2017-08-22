var express = require('express');
var router = express.Router();
var jwt             = require("jsonwebtoken");
var bcrypt = require('bcryptjs');
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

function compPassword (fromDB, candidate, cb) {
    bcrypt.compare(candidate, fromDB, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/* POST user information. */
router.post('/',function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query(configDB.query_getUserByEmail + "'" +req.body.email+ "'", function (err, rows) {
            if (err)
                throw err;
            if(rows.length > 0){
                var user = rows[0]
                compPassword(user.password, req.body.password, function(err, isMatch){
                    if (err) throw err;

                    if(isMatch){
                        if(user.token == '-'){
                            res.json({
                                type: false,
                                data: "not permitted"
                            });
                        }else {
                            const secret = req.app.get('jwt-secret');
                            user.token = '';
                            user.token = jwt.sign(user, secret);
                            connexion.query("UPDATE users SET token = '" + user.token + "' WHERE email = '" + req.body.email + "'", function (err1, result) {
                                if(err1) throw err1
                                if(result.affectedRows > 0){
                                    res.json({
                                        type: true,
                                        data: user,
                                        token: user.token
                                    });
                                } else {
                                    res.json({
                                        type: false,
                                        data: 'DB error'
                                    });
                                }
                            })
                        }
                    } else {
                        res.json({
                            type: false,
                            data: "Incorrect email/password"
                        });
                    }
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
            connexion.release();
        });
    })
});

module.exports = router;