/**
 * Created by NCS-KSW on 2017-08-11.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var toolBox = require('../../models/toolBox');

router.put('/',toolBox.checkPermission ,function (req, res, next) {
    var filepath = '../video/' + req.body.filename;

    fs.stat(filepath, function(err, stats){
        if(err){
            res.json({
                type: false,
                data: err.message
            })
        } else {
            fs.unlink(filepath, function (err) {
                if (err) {
                    res.json({
                        type: false,
                        data: err.message
                    })
                } else {
                    res.json({
                        type : true,
                        data : req.body.filename + ' removed'
                    })
                }
            });
        }
    })
});

module.exports = router;