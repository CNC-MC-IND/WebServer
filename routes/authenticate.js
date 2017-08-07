var express = require('express');
var router = express.Router();
var User     = require('../models/User');
var jwt             = require("jsonwebtoken");
/* POST user information. */
router.post('/', function(req, res, next) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                if(user.token == 'not permitted'){
                    res.json({
                        type: false,
                        data: "Admin does not permit yet"
                    });
                } else {
                    const secret = req.app.get('jwt-secret');
                    user.token = '';
                    user.token = jwt.sign(user, secret);
                    user.save(function () {
                        res.json({
                            type: true,
                            data: user,
                            token: user.token
                        });
                    });
                }
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});

module.exports = router;