const sharp = require("sharp");
const { cloudinary } = require("../Utilities/cloudinary");
const { Post } = require("../Models/post.model");
const { User } = require("../Models/user.model");
const { Comment } = require("../Models/comment.model");
const { getReceiverSocketId, io } = require("../socket/socket");
const { text } = require("express");
const { HeartNotification } = require("../Models/notification.model");


exports.createPost = async (req, res) => {
  try {
    
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Media required.",
        success: false,
      });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`; 
    //  or you can use getDataUri func present in utlities but there will some error 

    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })

      .populate({
        path: "comments",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "commentor", select: "username profilePicture" },
      })

      

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserPost = async (req, res) => {
  try {
    const userId = req.id;
    const { posts } = await User.findById(userId);
    if (!posts) {
      return res.status(200).json({
        message: "User has not posted anything yet",
        success: true,
      });
    }
    const userPosts = await User.findById(userId)
      .populate({
        path: "posts",
        sort: { createdAt: -1 },
        populate: {
          path: "likes",
          sort: { createdAt: -1 },
          select: "username profilePicture",
        },
        populate: {
          path: "comments",
          sort: { createdAt: -1 },
          populate: { path: "commentor", select: "username profilePicture" },
        },
        populate: {
          path: "author",
          sort: { createdAt: -1 },
          select: "username profilePicture",
        },
      })
      .select("posts");

    return res.status(200).json({
      success:true,
      userPosts,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.likePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }

    await post.updateOne({ $addToSet: { likes: likerId } });
    await post.save();
    //implement socket io logic for notification
    const likerUser=await User.findById(likerId).select('username profilePicture')
    const postAuthorId=post?.author.toString() //so that if author likes his own post no notification than

    
   
   

    if(likerId!==postAuthorId){
      // emit a notification event
      // const notification={
      //   type:'like',
      //   userId:likerId,
      //   likerId,
      //   user:likerUser,
      //   postId,
      //   post,
      //   message:'liked your post',
      //   badge:true
      // }
      const heartNotification=await HeartNotification.create({
        type:'like',
        userId:likerId,
        receiverId:postAuthorId,
        user:likerId,
        postId,
        likerId,
        post:postId,
        message:'liked your posts',
        badge:true
      })
  
      await heartNotification.populate([
        { path: 'post', populate: { path: "author", select: "username profilePicture fullName" } },
        { path: 'user', select: "username profilePicture fullName" }
      ]);

      const postAuthorSocketId=getReceiverSocketId(postAuthorId)
      io.to(postAuthorSocketId).emit('notification',heartNotification)
      io.emit('updatePostDataforAll',heartNotification)
      
    }

    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const dislikerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }

    const { likes } = post;

    if (!likes) {
      res.status(400).json({
        message: "Post has 0 Likes.You cant disliked it",
      });
    }

    await post.updateOne({ $pull: { likes: dislikerId } });
    await post.save();

    //implement socket io logic for dislike
    const dislikerUser=await User.findById(dislikerId).select('username profilePicture')
    const postAuthorId=post?.author.toString() //so that if author likes his own post no notification than

    if(dislikerId!==postAuthorId){
      //emit a notification event
      const notification={
        type:'dislike',
        userId:dislikerId,
        user:dislikerUser,
     
        postId,
        post,
        message:'disliked your post',
        badge:false
      }
       

      await HeartNotification.findOneAndDelete({likerId:dislikerId,postId:postId})

      const postAuthorSocketId=getReceiverSocketId(postAuthorId)
      io.to(postAuthorSocketId).emit('notification',notification)
      io.emit('updatePostDataforAll',notification)


    }


    return res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addComment = async (req, res) => {
  try {
    const commnetorId = req.id;
    const postId = req.params.id;
    const { text } = req.body;
   const user=await User.findById(commnetorId).select("-password -email")
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      commentor: commnetorId,
      post: postId,
    });

    await comment.populate({
      path: "commentor",
      select: "username profilePicture",
    });

    //adding comment to post
    post.comments.push(comment._id);
    await post.save();
     
    //sending comment notification
    const postAuthorId=post?.author.toString()
    if(commnetorId!==postAuthorId){
    // const notification={
    //   type:'addComment',
    //   userId:commnetorId,
    //   user:user,
    //   message:`commented ${text} on your post`,
    //   post,
    //   commentId:comment?._id,
    //   badge:true
    // }

    const heartNotification=await HeartNotification.create({
      type:'addComment',
      userId:commnetorId,
      user:commnetorId,
      commentId:comment?._id,
      receiverId:postAuthorId,
      post:postId,
      message:`commented ${text} on your post`,
      badge:true
    })


    await heartNotification.populate([
      { path: 'post', populate: { path: "author", select: "username profilePicture fullName" } },
      { path: 'user', select: "username profilePicture fullName" }
    ]);
   
    const postAuthorSocketId=getReceiverSocketId(postAuthorId)
    io.to(postAuthorSocketId).emit('notification',heartNotification)

  }

 

    

    return res.status(201).json({
      message: "Comment Added",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: { $eq: postId } })
    .populate({
      path: "commentor",
      select: "username profilePicture",
      
    })
    if (!comments) {
      return res.status(404).json({
        message: "No comments found for this post",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

exports .deleteComment=async(req,res)=>{
  try {
    
    const userId=req.id
    const commentId=req.params.id
    
    const user=await User.findById(userId).select('-password -email')

    const comment=await Comment.findById(commentId)
    if(!comment){
      return res.status(404).json({
        message:"Comment not found",
        success:'false'
      })
    }

    const postId= comment.post
    const post=await Post.findById(postId)
    if(!post){
      return res.status(404).json({
        message:"Post not found",
        success:'false'
      })
    }
    if(comment.commentor.toString()!==userId.toString()){
      return res.status(403).json({
        message:"User invalid for the action.This user didn't posted this comment",
        success:'false'
      })
    }

    await Comment.findByIdAndDelete(commentId)

    //delete comment from postdb also
    await post.updateOne({$pull:{comments:commentId}})
    await post.save()

    //sending comment notification
    const postAuthorId=post?.author.toString()
    if(userId!==postAuthorId){
    const notification={
      type:'deleteComment',
      userId,
      user:user,
      message:'Uncommented on a post',
      post,
      commentId:comment?._id,
      
      badge:false
    }
    
    await HeartNotification.findOneAndDelete({commentId:comment?._id})
      
    const postAuthorSocketId=getReceiverSocketId(postAuthorId)
    io.to(postAuthorSocketId).emit('notification',notification)
    

  }
    

    

    return res.status(200).json({
      message:"Comment deleted",
      success:'true'
    })


  } catch (error) {
    console.log(error)
  }
}



exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "No such Post",
        success: false,
      });
    }

    //check if logged in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "loggedUser is not author of this post",
        success: false,
      });
    }

    //delete post
    await Post.findByIdAndDelete(postId);

    //remove postId from posts field of users db
    const user = await User.findById(authorId);
    await user.updateOne({ $pull: { posts: postId } });
    await user.save();

     //remove postId from bookmarks
     await user.updateOne({ $pull: { bookmarks: postId } });
    await user.save();

     


    //delete associated comment related to post
    await Comment.deleteMany({ post: { $eq: postId } });
    await HeartNotification.deleteMany({ post: { $eq: postId } });

    

   
    return res.status(200).json({
      message: "Boom! Post vanished like magic",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const user = await User.findById(userId);

    if(! user){
      
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    if ( user.bookmarks.includes(postId)) {
      //unsave or remove from bookmark logic
      await user.updateOne({ $pull: { bookmarks: postId } });
      await user.save();

      return res.status(200).json({
        type:"unsaved",
        message: "Post removed from bookmarks",
        success: true,
      });
    } else {
      // save or add to bookmark logic

      await user.updateOne({ $addToSet: { bookmarks: postId } });
      await user.save();

      return res.status(200).json({
        type:"saved",
        message: "Post added to bookmarks",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
