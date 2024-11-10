const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middlewares/isAuthenticated");
const {
  getUserNotifications,
  deleteHeartNotification,
} = require("../Controllers/notification.controller");

router
  .get("/getallnotifications", isAuthenticated, getUserNotifications)
  .delete("/delete/:id", isAuthenticated, deleteHeartNotification);

exports.notificationRouter = router;
