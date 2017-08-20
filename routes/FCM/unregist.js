var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

router.get('/', toolBox.checkPermission,function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        var token = req.headers["authorization"]
        connexion.query("UPDATE users SET fcm = '-' WHERE token = '" + token + "'", function (err1, result) {
            if(err1) throw err1
            if(result.affectedRows > 0){
                res.json({
                    type: true,
                    fcm : false
                });
            } else {
                res.json({
                    type: false,
                    data: 'DB error'
                });
            }
        })


        connexion.release();
    });
});

module.exports = router;
