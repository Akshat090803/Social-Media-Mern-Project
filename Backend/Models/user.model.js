const mongoose = require("mongoose");
const { Schema } = mongoose;
const passwordValidator = require('password-validator');

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true ,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(v);
        },
        message:`Username can contains only letters ,numbers,underscores and periods.`,
      },
    },
    fullName:{type:String , required:true},
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value}  is not a valid email address!`,
      },
    },
    password: { type: String, minlength:8, required: true },
    profilePicture: { type: String, default: "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png" },

    bio: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say"],
      default: "Male",
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    messageNotifications:[{type:Schema.Types.ObjectId,ref:"User"}]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
exports.User = User;
