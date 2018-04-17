var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const configDB = require('../../configDB');
var pool = mysql.createPool(configDB);
var toolBox = require('../../models/toolBox');

router.put('/',toolBox.checkPermission, function(req,res,next){
   pool.getConnection(function (err,connexion) {
       if(err){
           console.log(err);
           throw err;
       }


       var id = req.body.id;
       var onoff = req.body.onoff;

       var query = "INSERT into data (id, onoff) VALUES (?, ?)";
       var param = [id, onoff];
       console.log(query);
       connexion.query(query,param, function(err, result){
           if(err)
               throw err;
           if(result.affectedRows > 0){
               res.json({
                   type: true
               })
           }
           connexion.release();
       })

   })

});

router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connexion) {
        if (err)
            throw err;
        connexion.query("select data.seq_Num, data.id, data.onoff from data where data.onoff IS NOT NULL AND data.id="+req.headers['deviceid']+" order by seq_Num desc limit 1", function (err, rows) {
            if (err)
                throw err;
            console.log(rows)


            res.json({
                type : true,
                data : JSON.stringify(rows)
            });
            connexion.release();
        });
    })
});

router.post('/', function(req,res,next){
    pool.getConnection(function (err,connexion) {
        if(err){
            console.log(err);
            throw err;
        }
        var jsonData = req.body.data;

        var id = jsonData.id;
        var onoff = jsonData.onoff;

        var query = "INSERT into data (id, onoff) VALUES (?, ?)";
        var param = [id, onoff];
        console.log(query);
        connexion.query(query,param, function(err, result){
            if(err)
                throw err;
            if(result.affectedRows > 0){
                res.json({
                    type: true
                })
            }
            connexion.release();
        })

    })

});





module.exports = router;
