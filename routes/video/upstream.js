/**
 * Created by NCS-KSW on 2017-09-13.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var toolBox = require('../../models/toolBox');

router.post('/',function (req, res, next) {


});

// global.io.on('connection', function (client) {
//     console.log('Client connected....')
//
//     client.on('join', function (data) {
//         console.log('data receiveed')
//     })
// })

module.exports = router;