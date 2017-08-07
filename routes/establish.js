/**
 * Created by NCS-KSW on 2017-08-07.
 */
var express = require('express');
var router = express.Router();

/* GET initializing connection. */
router.get('/', function(req, res, next) {
    var organazation = req.app.get('organization');
    res.json({
        type: true,
        data: organazation
    });
});

module.exports = router;