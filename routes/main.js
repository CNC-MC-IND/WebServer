var express = require('express');
var config = require('../config');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main')

});
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    console.log(id)
    res.render('detail',{deviceid :id})

});
module.exports = router;
