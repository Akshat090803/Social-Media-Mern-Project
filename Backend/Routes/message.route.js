const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middlewares/isAuthenticated");
const {sendMessage, getMessage, mediaUpload}=require('../Controllers/conversation.controller')

const { upload } = require("../Middlewares/multer");


router
.post('/send/:id',isAuthenticated,upload.single('media'),sendMessage)
// .post('/media/:id',isAuthenticated,upload.single('media'),mediaUpload)
.get('/all/:id',isAuthenticated,getMessage)



exports.messageRouter=router