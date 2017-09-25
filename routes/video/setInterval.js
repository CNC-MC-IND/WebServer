/**
 * Created by NCS-KSW on 2017-09-22.
 */
var express = require('express');
var router = express.Router();
var toolBox = require('../../models/toolBox');

router.post('/', toolBox.checkPermission, function(req, res, next) {
    var id = req.body.id
    var interval = req.body.interval

    toolBox.videoConnexions[id] = interval

    res.json({
        type: true
    })
});

module.exports = router;
