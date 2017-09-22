/**
 * Created by NCS-KSW on 2017-09-22.
 */
var express = require('express');
var router = express.Router();
var toolBox = require('../../models/toolBox');

router.get('/', function(req, res, next) {
    var id = req.headers["id"]

    if(id === undefined){
        res.json({
            type: true,
            data: JSON.stringify(toolBox.videoConnexions)
        })
    } else {
        res.json({
            type : true,
            data: toolBox.videoConnexions[id]
        })
    }
});

module.exports = router;