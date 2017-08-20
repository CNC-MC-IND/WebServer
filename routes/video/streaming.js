/* HLS 프로토콜 사용 */
var express = require('express');
var router = express.Router();
var toolBox = require('../../models/toolBox');
var fs = require('fs');
var url = require('url');
var path = require('path');
var zlib = require('zlib');

router.post('/', toolBox.checkPermission,function(req, res, next) {
    var filepath = '../video/' + req.body.filename;

    fs.exists(filepath, function(exists){
        if(!exists){
            res.json({
                type : false,
                data : req.body.filename + " doesn't exist"
            })
        } else {
            console.log('sending file: ' + req.body.filename);
            switch (path.extname(filepath)) {
                case '.M3U8':
                    fs.readFile(filepath, function (err, contents) {
                        if (err) {
                            res.json({
                                type : false,
                                data : err.message
                            })
                        } else if (contents) {
                            res.writeHead(200,
                                {'Content-Type':
                                    'application/vnd.apple.mpegurl'});
                            var ae = req.headers['accept-encoding'];
                            if (ae.match(/\bgzip\b/)) {
                                zlib.gzip(contents, function (err, zip) {
                                    if (err) throw err;

                                    res.writeHead(200,
                                        {'content-encoding': 'gzip'});
                                    res.end(zip);
                                });
                            } else {
                                res.end(contents, 'utf-8');
                            }
                        } else {
                            res.json({
                                type : false,
                                data : 'empty playlist'
                            })
                        }
                    });
                    break;
                case '.ts':
                    res.writeHead(200, { 'Content-Type':
                        'video/MP2T' });
                    var stream = fs.createReadStream(filepath,
                        { bufferSize: 64 * 1024 });
                    stream.pipe(res);
                    break;
                default:
                    res.json({
                        type : false,
                        data : 'unknown file type: ' + path.extname(filepath)
                    })
            }
        }
    })
});

module.exports = router;
