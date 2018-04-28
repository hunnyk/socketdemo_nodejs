

var socket = io('http://192.168.200.158:3000');
function setUsername() {
    var uname=document.getElementById('name').value;
    socket.emit('setUsername', uname);
    console.log(uname);
};

var user;
socket.on('userExists', (data) => {
    document.getElementById('error-show').innerHTML = data;
});

socket.on('userSet', (data) => {
    user = data.username;
    document.body.innerHTML = '<input type="text" id="message">\
         <button type="button" name="button" onclick ="sendMessage()">Send</button>\
         <div id="message-container"></div>';
});

function sendMessage() {
    var msg = document.getElementById('message').value;
    console.log(msg);
    if(msg) {
        socket.emit('msg', {message: msg, user: user});
    }
}

socket.on('newmsg', (data) => {
    if(user) {
        document.getElementById('message-container').innerHTML += '<div><b>' +
            data.user + '</b>: ' + data.message + '</div>'
    }
})

