var express = require('express');
var router = express.Router();

var User     = require('../models/User');

/* POST signin. */
router.post('/', function(req, res, next) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user && user.email != undefined && user.password != undefined) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.token = 'not permitted';
                if(userModel.email == undefined || userModel.password == undefined) {
                    res.json({
                        type: false,
                        data: "Invalid input"
                    });
                    return;
                }
                userModel.save(function(err, user1) {
                    res.json({
                        type: true,
                        data: user1,
                        token: user1.token
                    })
                });
                /*
                userModel.save(function(err, user) { // DB 저장 완료되면 콜백 함수 호출
                    //user.token = jwt.sign(user, process.env.JWT_SECRET); // user 정보로부터 토큰 생성d
                    user.token = 'not permitted';
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })*/
            }
        }
    });
});

module.exports = router;
