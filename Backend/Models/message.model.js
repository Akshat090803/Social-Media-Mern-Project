//this is message model

const mongoose=require('mongoose')
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
});
exports. Message = mongoose.model('Message', messageSchema);