const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const path = require('path');
const publicPath = path.join(__dirname, '../../public');
app.use(express.static(publicPath));

const cors = require('cors');
app.use(cors());

var mysql=require('mysql');

var con=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'socketmsgdb'
})

isInitNotes = false

app.get('/', (req, res) => {
    res.sendFile('/media/lcom54/E/practicedemos/socketdemo1/public/home.html');
    //res.sendFile('public/home.html');
});

io.on('connection',(socket) => {
    console.log("A userrrr is connected");
    socket.on('status added',(status)=>{
        add_status(status,(res)=>{
            if(res){
                console.log(res);
                io.emit('refresh feed',status);
                console.log(status);
            } else {
                io.emit('error');
            }
        });
    });

    socket.on('status displayed',(status)=>{
        display_status(status,(res)=>{
            if(res){
                io.emit('refresh feed',status);
            } else {
                io.emit('error');
            }
        });
    });

});

var add_status = (status,callback) => {
    con.getConnection((err,connection) => {
        if (err) {
            callback(false);
            return;
        }
        connection.query("INSERT INTO `fbstatus` (`s_text`) VALUES ('"+status+"')",(err,rows)=>{
            connection.release();
            if(!err) {
                callback(true);
            }
        });
        connection.on('error', (err) => {
            callback(false);
            return;
        });
    });
}

var display_status = (status,callback) => {
    con.getConnection((err,connection) => {
        if (err) {
            callback(false);
            return;
        }
        connection.query("SELECT * FROM `fbstatus`",(err,rows)=>{
            connection.release();
            if(!err) {
                callback(true);
            }
        });
        connection.on('error', (err) => {
            callback(false);
            return;
        });
    });
}



http.listen(3001, function() {
    console.log('listening on *:3001');
});
