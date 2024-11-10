const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middlewares/isAuthenticated");

const { upload } = require("../Middlewares/multer");
const {
  createPost,
  getAllPost,
  getUserPost,
  likePost,
  addComment,
  getCommentsOfPost,
  dislikePost,
  deletePost,
  deleteComment,
  bookmarkPost,
} = require("../Controllers/post.controller");
const { getUserNotifications } = require("../Controllers/notification.controller");

router
  .post("/addpost", isAuthenticated,upload.single('post'), createPost)
  .get("/all", isAuthenticated, getAllPost)
  .get("/userpost/all", isAuthenticated, getUserPost)
  .patch("/:id/like", isAuthenticated, likePost)
  .patch("/:id/dislike", isAuthenticated, dislikePost)
  .post("/:id/comment", isAuthenticated, addComment)
  .get("/:id/comment/all", isAuthenticated, getCommentsOfPost)
  .delete("/delete/:id", isAuthenticated, deletePost)
  .delete("/comment/delete/:id", isAuthenticated, deleteComment)
  .post("/:id/bookmark", isAuthenticated, bookmarkPost)
  



  exports .postRouter=router