/**
 * Created by NCS-KSW on 2017-08-07.
 */
var express = require('express');
var router = express.Router();
var jwt             = require("jsonwebtoken");
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

/* PUT approve. */
router.put('/',function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query(configDB.query_getUserByEmail + "'" +req.body.email+ "'", function (err, rows) {
            if (err)
                throw err;
            if(rows.length > 0){
                const secret = req.app.get('jwt-secret');
                //user.token = '';
                //user.token = jwt.sign(user, secret);

                connexion.query(configDB.query_approve + "'" +req.body.email+ "'", function (err1, result) {
                    if (err)
                        throw err
                    if(result.affectedRows > 0){
                        res.json({
                            type: true,
                            data: 'approved'
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
                    data: "Incorrect email"
                });
            }
            connexion.release();
        });
    })
});

module.exports = router;