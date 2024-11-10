// import express from "express"
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./Utilities/db_connect");
const { userRouter } = require("./Routes/user.route");
const { postRouter } = require("./Routes/post.route");
const { messageRouter } = require("./Routes/message.route");
const path = require("path");

const {app,io,server}=require('./socket/socket');
const {  notificationRouter } = require("./Routes/notification.route");

require("dotenv").config();

// const app = express();  this will be imported now from socket.js




// cors configuration
const corsOption = {
  // origin: "http://localhost:5173",
  origin: "https://social-media-mern-project.onrender.com",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//attaching user routes
app.use("/api/v1/user", userRouter);

//attaching post routes
app.use("/api/v1/post", postRouter);

//attaching message routes
app.use("/api/v1/message", messageRouter);

//for notifications

app.use("/api/v1/notification",notificationRouter)
console.log(__dirname)

//!for production
// app.use(express.static(path.join(__dirname,"/Frontend/dist")));
// app.get("*",(req,res)=>{
//   res.sendFile(path.resolve(__dirname,"Frontend","dist","index.html"));
// })
app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/dist/index.html"));
});


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  dbConnect();
  console.log("server started at Port 8080");
});
