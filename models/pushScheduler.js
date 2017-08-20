var toolBox = require('./toolBox')
var mysql = require('mysql');
const configDB = require('../configDB');
var pool = mysql.createPool(configDB);
var compVal = 0
var loopFlag = true
var async = require('async')
var delay = 5000

exports.start = function () {
    loopFlag = true
    async.forever(
        function (next) {
            if(!loopFlag) {
                console.log('pushScheduler stopped!')
                return
            }

            console.log('pushScheduler started!')
            pool.getConnection(function (err, connexion) {
                if (err)
                    throw err;
                connexion.query(configDB.query_data, function (err, rows) {
                    if (err)
                        throw err;

                    var item
                    for(var i=0; i<rows.length; i++){
                        item = rows[i]
                        compVal |= item.lubricant_machine |
                            item.lubricant_saw |
                            item.pressure_air_main |
                            item.pressure_oil_hydraulic |
                            item.servo_cut|
                            item. servo_transfer|
                            item. spindle|
                            item. safety_door|
                            item.depletion
                    }

                    if(compVal == 1)
                        toolBox.broadcastPush('CNC M/C Monitor','장비에 이상이 있습니다!')

                    connexion.release();
                });})


            setTimeout(function() {
                next();
            }, delay)
        },
        function(err) {
            console.error(err);
        }
    )

}

exports.stop = function () {
    loopFlag = false
}