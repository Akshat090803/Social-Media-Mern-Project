const mongoose=require('mongoose')
const { Schema } = mongoose;

const heartNotificationSchema=new Schema({
type:{type:String,required: true},
receiverId:{type:String,required: true},
userId:{type:String,required: true},
user:{type:Schema.Types.ObjectId,ref:'User',required:true},
postId:{type:String},
post:{type:Schema.Types.ObjectId,ref:'Post'},
message:{type:String,required: true},
badge:{type:Boolean,required:true},
commentId:{type:String},
likerId:{type:String},
followingId:{type:String},
},{ timestamps: true })




exports .HeartNotification=mongoose.model('HeartNotifications',heartNotificationSchema)