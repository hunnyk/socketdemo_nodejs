const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const path = require('path');
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

const cors = require('cors');
app.use(cors());


app.get('/', function(req, res) {
    //res.sendfile('index1.html');
    res.sendFile('/media/lcom54/E/practicedemos/socketdemo1/public/index1.html');
});

users=[];
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('setUsername', (data) => {

        if(users.indexOf(data)>-1) {
            console.log('username already exists');
            socket.emit('userExists',data+'username already exists');
        }
        else {
            console.log(data);
            users.push(data);
            socket.emit('userSet',{username:data});
        }
    });

    socket.on('msg',(data)=>{
        io.sockets.emit('newmsg',data);
    })

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
