/**
 * Created by NCS-KSW on 2017-08-14.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

router.post('/', toolBox.checkPermission,function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        var stringQuery = req.body.query
        if (stringQuery){
            connexion.query(stringQuery, function (err, rows) {
                if (err)
                    throw err;
                res.json({
                    type : true,
                    size : rows.length,
                    data : JSON.stringify(rows)
                });
                connexion.release();
            }).on('error', function (err) {
                res.json({
                    type : false,
                    data : err.message
                })
            });
        } else {
            res.json({
                type : false,
                data : 'Invalid Query'
            })
        }
    })
});

module.exports = router;

