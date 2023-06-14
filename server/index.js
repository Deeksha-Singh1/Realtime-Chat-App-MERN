const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes= require('./routes/userRoutes');
const messagesRoute = require('./routes/messagesRoute');
const socket = require('socket.io');

const app = express();

// used to load env variable from a '.env' file
require("dotenv").config();

//configure middleware
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log("db connected successfully");
}).catch((err)=>{
  console.log(err);
});

app.use('/api/auth',userRoutes);
app.use('/api/messages',messagesRoute);

//starting server on port 5000
const server = app.listen(process.env.PORT, ()=>{
  console.log(`Server started on Port ${process.env.PORT}`);
})

const io = socket(server,{
  cors:{
    origin:"http://localhost:3000",
    credentials: true,
  },
});


global.onlineUsers = new Map();
io.on("connection", (socket) => {
  
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

/* global.onlineUsers = new Map();: This line creates a global variable onlineUsers and assigns it a new instance of a Map. The Map is used to store the online users' information, where the user ID is the key and the corresponding socket ID is the value.

io.on("connection", (socket) => { ... });: This code sets up a listener for the "connection" event, which is triggered whenever a new client socket connects to the server. The socket parameter represents the individual socket connection for that client.

global.chatSocket = socket;: This line assigns the current socket to the chatSocket global variable. It stores the socket connection to be used globally within the server.

socket.on("add-user", (userId) => { ... });: This code listens for the "add-user" event emitted by the client. When this event is received, it expects a userId parameter indicating the ID of the user. The server then adds the user's information to the onlineUsers map, using the userId as the key and the socket ID (socket.id) as the value.

socket.on("send-msg", (data) => { ... });: This code listens for the "send-msg" event emitted by the client. It expects a data parameter containing the message information, such as the recipient ID (data.to) and the actual message (data.msg).

const sendUserSocket = onlineUsers.get(data.to);: This line retrieves the socket ID of the recipient user by looking up their user ID (data.to) in the onlineUsers map.

if (sendUserSocket) { ... }: This condition checks if the recipient user's socket ID is found in the onlineUsers map. If the recipient is online and their socket ID is available, the code inside the condition block is executed.

socket.to(sendUserSocket).emit("msg-recieve", data.msg);: This line emits the "msg-recieve" event to the recipient's socket connection (sendUserSocket). It sends the message (data.msg) as the payload of the event.*/