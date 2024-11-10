const mongoose=require('mongoose')

const { Schema } = mongoose;

const commentSchema=new Schema({
  text:{type:String,required:true},
  commentor:{type:Schema.Types.ObjectId,ref:'User',required:true},
  post:{type:Schema.Types.ObjectId,ref:'Post',required:true},
},{timestamps:true})


const Comment=mongoose.model('Comment',commentSchema);
exports.Comment=Comment