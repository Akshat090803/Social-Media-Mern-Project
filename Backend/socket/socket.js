const express = require("express");
const { Server } = require('socket.io');
const http = require('http');


const app=express()

const server=http.createServer(app)

const io=new Server(server,{
  cors:{
    origin:"https://social-media-mern-project.onrender.com/", //"http://localhost:5173"
    methods:['GET','POST']
  }
})

const userSocketMap={} //this will store socket id corresponding to user id for eg userId:sockeyID

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection',(socket)=>{
  const userId=socket.handshake.query.userId
  if(userId){
    userSocketMap[userId]=socket.id;
   
  }
  io.emit('getOnlineUsers',Object.keys(userSocketMap))

  socket.on('disconnect',()=>{
    if(userId){
        delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
});
})


module.exports ={
  app,server,io,getReceiverSocketId
}