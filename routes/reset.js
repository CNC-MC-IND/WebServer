/**
 * Created by NCS-KSW on 2017-08-08.
 */
var express = require('express');
var router = express.Router();
var User     = require('../models/User');

/* POST users listing. */
router.post('/', function(req, res, next) {
    User.findOne({organization: req.body.organization, name: req.body.name, email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if(user){
                if(req.body.password == undefined) {
                    res.json({
                        type: false,
                        data: "Invalid input"
                    });
                    return;
                }

                user.password = req.body.password;
                user.save(function(err, user1) {
                    res.json({
                        type: true,
                        data: user1
                    })
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect personal information"
                });
            }
        }
    });
});

module.exports = router;