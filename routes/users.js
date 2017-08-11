var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../configDB');
var pool = mysql.createPool(configDB);


/* GET users listing. */
router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
          throw err;
        connexion.query(configDB.query_users, function (err, rows) {
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
