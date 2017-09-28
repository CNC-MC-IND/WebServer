var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);

router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;

        var query = 'select * from users where token =\'-\'';
        connexion.query(query, function (err, rows) {
            if (err)
                throw err;

            console.log(rows);
            res.render('approve',{rows:rows});
            /*res.json({
                type : true,
                data : JSON.stringify(rows)
            });
            */
            connexion.release();
        });
    })
});

module.exports = router;
