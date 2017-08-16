/**
 * Created by NCS-KSW on 2017-08-16.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../models/toolBox');

router.get('/', toolBox.checkPermission,function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query(configDB.query_data, function (err, rows) {
            if (err)
                throw err;
            res.json({
                type : true,
                data : JSON.stringify(rows)
            });
            connexion.release();
        });
    })
});

module.exports = router;
