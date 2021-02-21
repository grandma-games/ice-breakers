var express = require('express');
var app = express();

var server = require('http').createServer(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

console.log("Server started.");

SOCKET_LIST = {}; 
var players = {};
var rooms = {};

// New User
var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){              
    console.log("New User");

    var playerId = Math.random();
    SOCKET_LIST[playerId] = socket;
    players[playerId] = {id:playerId, score:0, move:null}
    // Inform User's their ID
    socket.emit('setPlayerId', playerId);

    // User Sent Message
    socket.on('sendMsgToServer',function(data){     
        console.log("New Message Sent:" + data);
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat', data);
        }          
    });

    // User Disconnect
    socket.on('disconnect',function(){
        console.log("User Disconnect");
        delete SOCKET_LIST[socket.id];
    });

    // User Join X Room
    socket.on('joinRoom',function(data){
        if(rooms[data]){ // If it exists
            // Move Player to Room
        }
        else{

        }
    });

    // User Create X Room
    socket.on('createRoom',function(data){
        if(rooms[data]){ // If it exists
            // Move Player to Room
        }
        else{
            
        }
    });
});

server.listen(8000);