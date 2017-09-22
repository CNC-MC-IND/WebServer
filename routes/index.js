var express = require('express');
var config = require('../config');
var router = express.Router();

function whoAreYou(req, res, next){
    var userAgent = req.get('User-Agent');

    if(userAgent !== undefined){
        var result = userAgent.match('Dalvik');

        if(result == null){ // Browser connexion
            next();
        } else{ // App connexion
            res.status(403);
            res.send("Forbidden");
        }
    }
}

/* GET home page. */
router.get('/', whoAreYou,function(req, res, next) {
    //res.render('index.pug', {title : config.organization, message:'HELLO!'});
    res.render('index',{title:config.organization, message:'Hello!'})

});

module.exports = router;
