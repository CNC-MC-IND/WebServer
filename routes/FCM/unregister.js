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
        var email = req.body.email
        connexion.query("UPDATE users SET fcm = '-' WHERE email = '" + email + "'", function (err1, result) {
            if(err1) throw err1
            if(result.affectedRows > 0){
                res.json({
                    type: true,
                    data : result
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
