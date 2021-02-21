const express = require('express');
const app = express();

const server = require('http').createServer(app);

const data = require('./assets/data/topics.json');
const topics = data['topics'];

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Static resources
app.use('/assets', express.static('assets'));

console.log('Server started.');

SOCKET_LIST = {}; 
let players = {};
let currTopicIndex = Math.floor(Math.random() * topics.length);

// New User
const io = require('socket.io')(server);
io.sockets.on('connection', function(socket){              
  console.log('New User');

  let playerId = Math.random();
  SOCKET_LIST[playerId] = socket;
  players[playerId] = {id: playerId, score: 0, move: null}
  // Inform User's their ID
  socket.emit('setPlayerId', playerId);
  // Send Current Topic
  socket.emit('currentTopic', currTopicIndex);

  // User Sent Message
  socket.on('sendMsgToServer',function(data) {     
    console.log('New Message Sent:' + data);
    for(let i in SOCKET_LIST){
      SOCKET_LIST[i].emit('addToChat', data);
    }          
  });

  // User Disconnect
  socket.on('disconnect',function(){
    console.log('User Disconnect');
    delete SOCKET_LIST[socket.id];
  });

  // Update All Users' topics
  socket.on('askTopic',function(data){
    currTopicIndex = Math.floor(Math.random() * topics.length);
    for(let i in SOCKET_LIST){
      SOCKET_LIST[i].emit('currentTopic', currTopicIndex);
    } 
  });
});

server.listen(8000);