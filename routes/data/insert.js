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

        var jsonData = req.body.data;//JSON.parse(stringData)
        console.log(req.body.data);
        var query = "INSERT into data (id, lubricant_machine, lubricant_saw, pressure_air_main, pressure_oil_hydraulic, servo_cut, servo_transfer, spindle, safety_door, depletion, emission_barrel, yield_saw, total_workload, current_workload, timestamp) VALUES"

        var data = jsonData

        query += '(' +
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
                data.emission_barrel + "," +
            data.yield_saw + "," +
            data.total_workload + ", " +
            data.current_workload + ", " +
            data.timestamp + ")"
        /*
        if(jsonData.length > 1 && i !== jsonData.length-1){
            query += ','
        }*/

        console.log(query);
        connexion.query(query, function (err, rows) {
            if (err)
                throw err;
            if (rows.affectedRows < 1){
                res.json({
                    type : false,
                    data : 'affectedRows are smaller than 1'
                })
                return
            } else {
                res.json({
                    type : true
                })
            }
            connexion.release();

        });
    })
});

module.exports = router;
