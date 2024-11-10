
const sharp = require("sharp");
const { Conversation } = require("../Models/conversation.model");
// const model = require("../Models/message.model");
// const Message = model.Message;
const { Message } = require("../Models/message.model");

const { cloudinary } = require("../Utilities/cloudinary");
const { getDataUri } = require("../Utilities/dataUri");
const {io, getReceiverSocketId } = require("../socket/socket");
const { User } = require("../Models/user.model");

// for chatting
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    const mediaFile = req.file;

    const recieverUser=await User.findById(receiverId)

    

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Establish the conversation if not started
    if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }else {
        await conversation.save(); // Save conversation if it already exists
      }

    // declare newMessage we will define later
    let newMessage;

    //!if message is a text

    if (message) {
      newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });
    }

    // !if there is media

    let cloudResponse;

    if (mediaFile) {
      const optimizedImageBuffer = await sharp(mediaFile.buffer)
        .resize({ fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
        // converting in uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
            "base64"
          )}`;
      cloudResponse = await cloudinary.uploader.upload(fileUri);

      newMessage = await Message.create({
        senderId,
        receiverId,
        message: cloudResponse.secure_url,
      });
    }

    //if there is newMessage
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save(); // Save conversation after updating messages
      await User.findByIdAndUpdate(receiverId,{$addToSet:{messageNotifications:senderId}})

     
    }
    // await recieverUser.updateOne({$addToSet:{messageNotifications:senderId}})

    
// try {
//   // await User.findByIdAndUpdate(senderId,{$addToSet:{messageNotifications:senderId}})
//   await recieverUser.updateOne({$addToSet:{messageNotifications:senderId}})
//   await recieverUser.save()
 
  
  
// } catch (error) {
//   console.log(error)
// }

    await Promise.all([ newMessage.save(),recieverUser.save()]);



     // Check if conversation is still null after creation
     if (!conversation) {
        // Handle error: Conversation could not be created
        return res.status(500).json({ error: 'Failed to create conversation' });
      }

      //implement socket for message
      const receiverSocketId=getReceiverSocketId(receiverId)
     if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',newMessage)
     }
 
     if(newMessage && receiverSocketId){
      io.to(receiverSocketId).emit('messageNotification',newMessage)
     }


    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log(error);
  }
};
