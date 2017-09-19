/**
 * Created by NCS-KSW on 2017-09-06.
 */
var express = require('express');
var router = express.Router();
var toolBox = require('../../models/toolBox');
var HLSServer = require('hls-server')
var http = require('http')

var server = http.createServer()
var hls = new HLSServer(server, {
    path: '/streams',     // Base URI to output HLS streams
    dir: '/video'  // Directory that input files are stored
})
server.listen(8000)
router.get('/',toolBox.checkPermission ,function (req, res, next) {

});

module.exports = router;