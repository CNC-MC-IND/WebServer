var express = require('express');
var router = express.Router();

function whoAreYou(req, res, next){
    var device = 'pc';
    var userAgent = req.get('User-Agent');

    var result = userAgent.match('Dalvik');

    if(result == null){
        next();
    } else{
        res.status(403);
        res.send("Forbidden");
    }
}

/* GET home page. */
router.get('/', whoAreYou,function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.render('index.html');
});

module.exports = router;
