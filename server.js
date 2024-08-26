const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const user = require('./route/user');
const auth = require('./route/auth')
const message = require('./route/messages');
const file = require('./route/file');

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ChatService')
  .then(() => console.log(`connect to mongodb...`))

app.get('/', (req, res) => {
  res.sendFile(__dirname, 'index.html');
})

app.use('/user', user);
app.use('/auth', auth);
app.use('/message', message);
app.use('/file', file);


io.on('connection', (socket) => {
  console.log('user connected...');

  socket.on('chat message', (msg) => {
    {
      socket.broadcast.emit('chat message', msg)
    }
  })


  socket.on('uploadFile', (msg) => {
    {
      socket.broadcast.emit('uploadFile', msg)
    }
    io.emit('displayFile', {fileName:msg.fileName,username:msg.username})
  })


  socket.on('seenMessage',(data)=>{
    {
      // socket.broadcast.emit('seenMessage',data)
      socket.broadcast.to(data.socketId).emit('seenMessage',{reciever:data.reciever})
    }
  })


  // socket.on('disconnect',()=>{
  //   console.log(`a user with ${socket.id} disconnected`);

  // })

})

app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
  console.log('This is the rejected field ->', error.message)
});



const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening to port: ${port}`))



