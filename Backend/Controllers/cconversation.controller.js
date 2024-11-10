//for chatting functionality
const sharp = require("sharp");
const { Conversation } = require("../Models/conversation.model");
const { Message } = require("../Models/message.model");
const { cloudinary } = require("../Utilities/cloudinary");
const { getDataUri } = require("../Utilities/dataUri");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.id; // Assuming user ID is in req.user._id
    const receiverId = req.params.id;
    const { message } = req.body;
    const mediaFile = req.file;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Establish the conversation if not started
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    let newMessage;

    // If message is a text
    if (message) {
      newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });
    }

    // If there is media
    if (mediaFile) {
      const optimizedImageBuffer = await sharp(mediaFile.buffer)
        .resize({ fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = getDataUri(optimizedImageBuffer);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);

      newMessage = await Message.create({
        senderId,
        receiverId,
        message: cloudResponse.secure_url,
      });
    }

    // If there is a new message, add it to the conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMessage = async (req,   
 res) => {
  try {
    const senderId = req.id; // Assuming user ID is in req.user._id
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .populate('messages')
      .exec();

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//!i have implemented media upload logic in sendMesssage also if there it not work use mediaUpload api if it also not work remove the uplaod functionality
exports .mediaUpload=async (req,res)=>{
  try {
    const senderId = req.body;
    const receiverId = req.params.id;
  
    const mediaFile=req.file

    if(!mediaFile){
      return res.status(400).json({
        success:false,
        messages:'No media uploaded',
        
      })
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    // establish the converstaion if not started
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({  fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri=getDataUri(optimizedImageBuffer)
    let cloudResponse=await cloudinary.uploader.upload(fileUri)

    const newMessage = await Message.create({
      senderId,
      receiverId,
      media:cloudResponse.secure_url,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation?.save(), newMessage?.save()]);

    return res.status(201).json({
      success:true,
      newMessage
  })
  

    

  } catch (error) {
    console.log(error)
  }

}