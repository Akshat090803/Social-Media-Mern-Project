//this is conversation model schema
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema({
  participants:[ { type: Schema.Types.ObjectId, ref: "User", required: true }],
  
  messages: [{type:Schema.Types.ObjectId,ref:'Message'}],
  
});


const Conversation=mongoose.model('Conversation',conversationSchema);
exports.Conversation=Conversation