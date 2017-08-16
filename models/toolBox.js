/**
 * Created by NCS-KSW on 2017-08-11.
 */
var mysql = require('mysql');
const configDB = require('../configDB');
var pool = mysql.createPool(configDB);

exports.checkPermission = function(req, res, next){
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query(configDB.query_toolBox_compToken + "'" + req.headers["authorization"] + "'", function (err, rows) {
            if (err)
                throw err;
            if(rows.length !== 0){
                next();
            } else {
                res.json({
                    type : false,
                    data : 'Invalid token'
                })
            }
            connexion.release();
        });
    })
}