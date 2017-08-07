/**
 * Created by NCS-KSW on 2017-08-07.
 */
var express = require('express');
var router = express.Router();
var User     = require('../models/User');
var jwt             = require("jsonwebtoken");

/* PUT approve. */
router.put('/', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                const secret = req.app.get('jwt-secret');
                user.token = '';
                user.token = jwt.sign(user, secret);
                user.save(function () {
                    res.json({
                        type: true,
                        data: user
                    });
                });

            } else {
                res.json({
                    type: false,
                    data: "Incorrect email"
                });
            }
        }
    });
});

module.exports = router;