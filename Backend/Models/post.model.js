const mongoose=require('mongoose')
const { Schema } = mongoose;

const postSchema=new Schema({
  caption:{type:String,default:''},
  hashtags:[{type:String,default:''}],
  image:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'User',required:true},
  likes:[{type:Schema.Types.ObjectId,ref:'User'}],
  comments:[{type:Schema.Types.ObjectId,ref:'Comment'}],
  
},{timestamps:true})

const Post=mongoose.model('Post',postSchema);
exports.Post=Post;