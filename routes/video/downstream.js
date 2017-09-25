/**
 * Created by NCS-KSW on 2017-09-14.
 */
/// Video UDP
var fs = require('fs');
var sender = {}

var tmp = require('tmp')

const udp_dgram = require('dgram')
const udp_server = udp_dgram.createSocket('udp4')



udp_server.on('error', (err) => {
    console.log('server error:\n${err.stack}')
    udp_server.close()
})

udp_server.on('message', (msg, rinfo) => {
   // console.log('server got: ${msg} from ${rinfo.address}:${rinfo.port}')
    var arr = msg.toString().split('&&')

    var id = arr[0].split(':')[1]
    var data = arr[1].split(':')[1]

    try{
        if(sender[id] === undefined){
           // sender[id] = fs.createWriteStream('../tmp/'+id+'.h264', {flags : 'w'})
            var stream = tmp.fileSync()
            stream.setGracefulCleanup()
            sender[id] = fs.createWriteStream(stream.fd, {flags:'w'})
            console.log("tmp created " + stream.name)
        }
        console.log('tmp write')
        sender[id].write(data)

        //sender[id].close()
    } catch (err){
        console.log(err.message)
    }


    //clients[JSON.stringify([rinfo.address, rinfo.port, id])] = data

})

// function broadcastNew() {
//     var message = 'hello'
//
//     for (var client in clients){
//         var data = clients[client]
//         client = JSON.parse(client)
//         var id = client[2]
//         var port = client[1]
//         var address = client[0]
//         udp_server.send(message, 0, message.length, port, address)
//     }
//     console.log('Sent ' + message + " to the wire...")
// }

function resetClients() {
    sender = {}
}

udp_server.on('listening', () => {
    var address = udp_server.address()
    console.log('server listening ${address.address}:${address.port}')

    //setInterval(broadcastNew, 100)
    //setInterval(resetClients, 10000)
})

udp_server.bind(3003)
/**/
var net = require('net')

var server = net.createServer()
var port = 3004

var connections = {}

server.on('listening', function () {
    console.log('Server is listening on port ', port)
})
var MultiStreamRecorder = require('msr');
server.on('connection', function (socket) {
    console.log('Server has a new connexion')
   // var stream = tmp.fileSync()
   // tmp.setGracefulCleanup()
   // connections[0] = fs.createWriteStream(stream.name)
   // socket.pipe(connections[0], {end:false})
    var time = new Date()
    var file = fs.createWriteStream('../video/rec_' + time.getHours() + '' + time.getMinutes() + '' + time.getSeconds()+'.h264', {flags:'w'})
    setTimeout(stopFile, 3000, file)
    //var buf = new Buffer(socket)
    var flg = true
    socket.on('data', function (data) {
        if(data.length < 10){
            var payload = data.toString()
            var arr = payload.split('=')
            if(arr[0] == 'id'){
                connections[arr[1]] = socket
                socket.write('Authed!')
            }
        } else {
            if(file !== undefined){
                //file.write(data)
                if(flg){
                   // file.write(buf, "binary")
                    flg = false
                }
            }
        }
    })
})

function stopFile(file) {
    file.end()
}

server.listen(port)

/**/

/// hls

var express = require('express');
var router = express.Router();
var fs = require('fs');
var toolBox = require('../../models/toolBox');

var sessions = {}

router.get('/',function (req, res, next) {
    var params = req.baseUrl.split('/')
    //var cctvID  = params[params.length-1]
    var cctvID = '1'

    if(connections[cctvID] !== undefined){
        res.writeHead(200, { 'Content-Type':
            'video/mp4'});
        //var stream = fs.createReadStream(connections[0].path, { bufferSize: 64 * 1024 });
        //stream.pipe(res);
        connections[cctvID].pipe(res)
    } else {
        res.status(403)
        res.send('Error : invalid request')
    }
});

module.exports = router;