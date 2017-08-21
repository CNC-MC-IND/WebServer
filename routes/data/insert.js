/**
 * Created by NCS-KSW on 2017-08-21.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);

router.post('/',function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;

        var stringData = req.body.data
        var jsonData = JSON.parse(stringData)

        for( var i=0; i<jsonData.length; i++){
            var data = jsonData[i]

            var query = "INSERT into data (id, lubricant_machine, lubricant_saw, pressure_air_main, pressure_oil_hydraulic, servo_cut, servo_transfer, spindle, safety_door, depletion, workload, timestamp)" +
                " VALUES (" +
                data.id + ", " +
                data.lubricant_machine + ", " +
                    data.lubricant_saw + ", " +
                    data.pressure_air_main + ", " +
                    data.pressure_oil_hydraulic + ", " +
                    data.servo_cut + ", " +
                    data.servo_transfer + ", " +
                    data.spindle + ", " +
                    data.safety_door + ", " +
                    data.depletion + "," +
                data.workload + ", " +
                data.timestamp +
                    ");"

            connexion.query(query, function (err, rows) {
                if (err)
                    throw err;
                if (rows.affectedRows < 1){
                    res.json({
                        type : false,
                        data : 'affectedRows are smaller than 1'
                    })
                    return
                }
                connexion.release();
            });
        }


    })
});

module.exports = router;
