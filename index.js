const express = require('express');
const app = express();

const server = require('http').createServer(app);

const topics = require('./assets/data/topics.json')['topics'];

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Static resources
app.use('/assets', express.static('assets'));

console.log('Server started.');

SOCKET_LIST = {}; 
let players = {};
let topicIdx = Math.floor(Math.random() * topics.length);

// New User
const io = require('socket.io')(server);
io.sockets.on('connection', function(socket) {              
  console.log('New User');

  let playerId = Math.random();
  SOCKET_LIST[playerId] = socket;
  players[playerId] = {id: playerId, score: 0, move: null}
  // Inform User's their ID
  socket.emit('setPlayerId', playerId);
  // Send Current Topic
  socket.emit('currentTopic', topics[topicIdx]);

  // User Sent Message
  socket.on('sendMsgToServer',function(data) {     
    console.log('New Message Sent:' + data);
    for(let i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', data);
    }          
  });

  // User Disconnect
  socket.on('disconnect',function() {
    console.log('User Disconnect');
    delete SOCKET_LIST[socket.id];
  });

  // Update All Users' topics
  socket.on('askTopic',function(data) {
    topicIdx = Math.floor(Math.random() * topics.length);
    for(let i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('currentTopic', topics[topicIdx]);
    } 
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
