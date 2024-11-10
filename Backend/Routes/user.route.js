const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middlewares/isAuthenticated");

const userController = require("../Controllers/user.controller");
const { upload } = require("../Middlewares/multer");



router
  .post("/register", userController.register)
  .post("/login", userController.login)
  .get("/logout", userController.logout)
  .get("/getuser/:id",userController.getLoggedUser)
  .get("/:id/profile", isAuthenticated, userController.getProfile)
  .post(
    "/profile/edit",
    isAuthenticated,
    upload.single("profilePicture"),
    userController.editProfile
  )
  .get("/suggested", isAuthenticated, userController.getSuggestedUsers)
  
  .post(
    "/followorunfollow/:id",
    isAuthenticated,
    userController.followOrUnfollow
  )
  .patch('/removeid',isAuthenticated,userController.removeFromMessageNotifications)
  
exports.userRouter = router;
