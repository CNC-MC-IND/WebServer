/**
 * Created by NCS-KSW on 2017-08-22.
 */
var express = require('express');
var config = require('../config');
var router = express.Router();

function whoAreYou(req, res, next){
    var userAgent = req.get('User-Agent');
    var result = userAgent.match('Dalvik');

    if(result == null){ // Browser connexion
        next();
    } else{ // App connexion
        res.status(403);
        res.send("Forbidden");
    }
}

router.get('/',whoAreYou,function(req, res, next) {
    res.redirect('/index')
});

module.exports = router;
