var express = require('express');
var router = express.Router();
var toolBox = require('../../models/toolBox');
var multer = require('multer');
var fs = require('fs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var id = req.headers["id"]
        var path = '../video/' + id
        try{
            fs.mkdirSync(path)
        } catch (err){
            if(err.code !== 'EEXIST') throw err
        }

        cb(null, path) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})
var upload = multer({storage: storage})
//var upload = multer({ dest: 'uploads/' })

var type = upload.single('file');

router.post('/', toolBox.checkPermission, function (req, res) {

    if (req.headers["id"] === undefined) {
        res.json({
            type: false,
            data: 'Invalid ID'
        })
    } else {
        type(req, res, function (err) {
            if (err) {
                res.json({
                    type: false,
                    data: err.message
                })
            } else {
                res.json({
                    type: true,
                    data: req.file.originalname
                })
            }
        })
    }
});
module.exports = router;