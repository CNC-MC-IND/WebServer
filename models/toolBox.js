/**
 * Created by NCS-KSW on 2017-08-11.
 */
var mysql = require('mysql');
const configDB = require('../configDB');
var pool = mysql.createPool(configDB);

const configFCM = require('../configFCM')
var FCM = require('fcm-push')
var fcm = new FCM(configFCM.serverKey)

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

exports.broadcastPush = function (title, msg) {
    pool.getConnection(function (err, connexion) {
        connexion.query(configDB.query_getFcmList, function (err, rows) {
            if (err)
                throw err;
            if(rows.length !== 0){
                var registrationIds = [];
                for( var i =0; i< rows.length; i++){
                    registrationIds.push(rows[i]['fcm'])
                }

                var message = {
                    registration_ids : registrationIds,
                    //collapse_key: 'jumpsnack',
                    priority : 'high',
                    data: {
                        title: title,
                        body: msg
                    }
                }

                fcm.send(message, function (err, response) {
                    if(err) throw err
                    //else console.log(response)
                })
            }
            connexion.release();
        });

    })
}

exports.videoConnexions = {}