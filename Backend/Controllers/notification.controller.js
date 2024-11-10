const { HeartNotification } = require("../Models/notification.model");

exports. deleteHeartNotification = async (req, res) => {
  try {
    const  notificationId  = req.params.id;

    const noti = await HeartNotification.findById(notificationId);

    if (!noti) {
      return res.status(404).json({
        message: "No such Notification",
        success: false,
      });
    }

    await HeartNotification.findByIdAndDelete(notificationId);

    return res.status(200).json({
      message: "Notification removed",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports. getUserNotifications = async (req, res) => {
  try {
    const userId = req.id;

    

    const notifications = await HeartNotification.find({
      receiverId: { $eq: userId },
    }).populate([
      {
        path: "post",
        populate: {
          path: "author",
          select: "username profilePicture fullName",
        },
      },
      { path: "user", select: "username profilePicture fullName" },
    ]).sort({createdAt:-1});

    res.status(200).json({
      success: true,
      notifications: notifications,
    });
  } catch (error) {
    console.log(error);
  }
};
