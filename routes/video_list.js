/**
 * Created by NCS-KSW on 2017-08-10.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function (req, res, next) {
    fs.readdir('../video', function (err, list) {
        if (err) {
            res.json({
                type: false,
                data: err.message
            })
        } else {
            res.json({
                type : true,
                data : JSON.stringify(list)
            })
        }
    });
});

module.exports = router;