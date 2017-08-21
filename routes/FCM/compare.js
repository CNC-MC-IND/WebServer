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
        var fcm = req.body.fcm
        connexion.query("SELECT * FROM users WHERE fcm = '"+fcm+"' AND email = '"+email+"'", function (err1, rows) {
            if(err1) throw err1
            if(rows.length > 0){
                res.json({
                    type: true,
                    data : rows,
                    fcm : fcm
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
