const { User } = require("../Models/user.model");
const passwordValidator = require("password-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { cloudinary } = require("../Utilities/cloudinary");
const { getDataUri } = require("../Utilities/dataUri");
const { Post } = require("../Models/post.model");
const { HeartNotification } = require("../Models/notification.model");
const { io, getReceiverSocketId } = require("../socket/socket");

// Add properties to it
const passowrdSchema = new passwordValidator();
passowrdSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have atleast 1 digits
  .has()
  .symbols(1); // Must have atleast 1symbols

// way  2 of validation first way is above using password-validation .here we validate username using regex exp
const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;

// Function to validate the username
function validateUsername(username) {
  return usernameRegex.test(username);
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    //!checking if all fields are entered or not
    if (!username || !email || !password || !fullName) {
      return res.status(401).json({
        message:
          "Some fields have not been filled in. Kindly complete all the fields.",
        success: false,
      });
    }

    // !validating username
    const validate_username = validateUsername(username);
    if (!validate_username) {
      return res.status(401).json({
        message: `Username can contains only letters ,numbers,underscores and periods`,
        err: {
          usernameError: `Username must start with a letter, or underscore, and can contain letters, digits, underscores, and dots.`,
        },
        success: false,
      });
    }

    // !checking user with email already exist or not
    const user = await User.findOne({ email: { $eq: email } });
    if (user) {
      return res.status(401).json({
        message: "User email already exist. Try another email.",
        err: { emailError: "User email already exist. Try another email." },
        success: false,
      });
    }
    // !checking user with username already exist or not
    const checkUserName = await User.findOne({ username: { $eq: username } });
    if (checkUserName) {
      return res.status(401).json({
        message: "Username already taken",
        err: { usernameError: "Username already taken" },
        success: false,
      });
    }

    // //!validating password
    // !we gave in frontend that minPassword length =8
    const validatePassword = passowrdSchema.validate(password);
    if (!validatePassword) {
      return res.status(401).json({
        message:
          "Password is not strong enough! It must be at least 8 characters long, contain uppercase and lowercase letters, digits, and symbols",

        err: {
          passwordError:
            "Password is not strong enough! It must be at least 8 characters long, contain uppercase and lowercase letters, digits, and symbols",
        },
        success: false,
      });
    }

    //encrypting password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
    });
    newUser
      .save()
      .then((doc) => {
        return res.status(201).json({
          message: "Account created successfully",
          success: true,
        });
      })
      .catch((err) => res.status(401).json(err));
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    // const login_way=req.body.email || req.body.username
    // const password=req.body.password
    const incorrectEmail = [
      "Email hiding! Try another. Let's find a match!",
      "Email lost in cyberspace! Try another one!",
      "Oops! Looks like your email is playing hide and seek with our database. Let's try a different email",
    ];

    const incorectPassword = [
      "Password being sneaky! Another go, maybe?",
      "Password playing tricks! Try again! ",
      "Password playing hard to get! Give it another shot",
    ];

    let randomIndex = Math.floor(Math.random() * 3);

    const { email, password } = req.body;
    // checking user exist or not

    let user = await User.findOne({ email: { $eq: email } });
   
    if (!user) {
      return res.status(401).json({
        message: incorrectEmail[randomIndex],
        success: false,
        err: { emailError: incorrectEmail[randomIndex] },
      });
    }

    //checking password matches or not

    const isPasswordmatched = await bcrypt.compare(password, user.password);
    if (!isPasswordmatched) {
      return res.status(401).json({
        message: incorectPassword[randomIndex],
        success: false,
        err: { passwordError: incorectPassword[randomIndex] },
      });
    }

    //setting user data to sent on succesfull login

    // user = {
    //   _id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   followers: user.followers,
    //   following: user.following,
    //   profilePicture: user.profilePicture,
    //   bio: user.bio,
    //   posts: user.posts,
    // };

    //populating user before sendng
    user = await User.findById(user._id)
      .populate({ path: "posts" })
      .select("-password");

    // generating token
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const successLogin = [
      `Welcome back, ${
        user.fullName ? user.fullName.split(" ")[0] : user.username
      }! Ready to rock and roll?`,
      `${
        user.fullName.split(" ")[0]
      } returns like a boss! Welcome back, buddy!`,
      `Guess who's back, back again... it's ${user.fullName.split(" ")[0]}!`,
    ];

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: successLogin[randomIndex],
        success: true,
        user: user,
      });
  } catch (error) {
    console.log(error);
  }
};

//logging out
exports.logout = async (req, res) => {
  try {
    const token = await req.cookies.token;
   
    if (!token) {
      return res.status(400).json({
        message: "Unable to logout",
        success: false,
      });
    }
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "You've successfully escaped the digital vortex!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get profile

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "author", select: "username profilePicture" },
      })
      .populate({
        path: "bookmarks",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "author", select: "username profilePicture" },
      })
      .populate({ path: "following", select: "username profilePicture fullName" })
      .populate({ path: "followers", select: "username profilePicture fullName" })
      .select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//edit profile

exports.editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender,fullName } = req.body;

    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }
    if( fullName){
      user.fullName=fullName
    }
    if (profilePicture) {
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();
    return res.status(200).json({
      message: "Profile updated",
      success: "true",
      user,
    
    });
  } catch (error) {
    console.log(error);
  }
};

// user suggestions

exports.getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-passowrd"
    );

    if (!suggestedUser) {
      return res.status(400).json({
        message: "currently don't have any users for suggestion",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

//follow unfollow

exports.followOrUnfollow = async (req, res) => {
  try {
    const followingId = req.id; //follow krne wala
    const followedId = req.params.id; //jise follow kra

    const followingUser = await User.findById(followingId).select("-password"); //follow krne wala
    const followedUser = await User.findById(followedId).select("-password"); //jise follow kra

    //checking if both are same or not as we cant follow ourself

    if (followingId === followedId) {
      return res.status(400).json({
        message: "Follower and Followed user must be different.",
        success: false,
      });
    }

    //checking if users exist

    if (!followingUser || !followedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    //checking whether action is to follow or unfollow

    const isFollowing = followingUser.following.includes(followedId); //checking if we are already following or not
    if (isFollowing) {
      //? we need action to unfollow . Unfollow logic


      // const heartNotification=await HeartNotification.create({
      //   type
      // })
      const notification={
        type:'unfollow',
        userId:followingId,
      }

      const UserSocketId=getReceiverSocketId(followedId)
      io.to(UserSocketId).emit('notification',notification)
      

      await HeartNotification.findOneAndDelete({followingId:followingId,receiverId:followedId})


      await Promise.all([
        User.updateOne(
          { _id: { $eq: followingId } },
          { $pull: { following: followedId } }
        ),
        User.updateOne(
          { _id: { $eq: followedId } },
          { $pull: { followers: followingId } }
        ),
      ]);
//we are senfing userProfile so that we can update userProfile state of redux in frontend
      const userForUserProfileUpdate=await User.findById(followingId).select('profilePicture username fullName')
   

      return res.status(200).json({
        action:'unfollow',
        message: "Unfollowed Successfully",
        success: true,
        userForUserProfileUpdate,
        isFollowing:false,
    
        
      });
    } else {
      //if isfollowinf false means we need action to follow . Follow logic

      const heartNotification=await HeartNotification.create({
        type:'follow',
        userId:followingId,
        followingId:followingId,
        user:followingUser,
        message:`started following you`,
        receiverId:followedId,
        badge:true
      })
      
      const UserSocketId=getReceiverSocketId(followedId)
      io.to(UserSocketId).emit('notification',heartNotification)
    
    

      // ?followingUser.following=[...followingUser.following,followedId]
      // ?followedUser.followers=[...followedUser.followers,followingId]
      //? await followedUser.save()
      // ?await followingUser.save()
      // !upper logic is also correct but we will use push and pop method

      await Promise.all([
        User.updateOne(
          { _id: { $eq: followingId } },
          { $push: { following: followedId } }
        ),
        User.updateOne(
          { _id: { $eq: followedId } },
          { $push: { followers: followingId } }
        ),
      ]);
      //we are senfing userProfile so that we can update userProfile state of redux in frontend
      const userForUserProfileUpdate=await User.findById(followingId).select('profilePicture username fullName')
     
      return res.status(200).json({
        action:'follow',
        message: "Followed Successfully",
        success: true,
        userForUserProfileUpdate,
        isFollowing:true,
        
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports .removeFromMessageNotifications=async(req,res)=>{
 try {
  const userId=req.id
  const removeId=req.body.removeId
  await User.findByIdAndUpdate(userId,{$pull:{messageNotifications:removeId}})

  return res.status(200).json({
         success:true
  })
 } catch (error) {
  console.log(error)
 }

}


exports .getLoggedUser=async(req,res)=>{
  try {

    const token = await req.cookies.token;

    if(!token){
      return res.status(401).json({
        success:false,
        message:"Authentication Token Not Found."
      })
    } 

    const userId=req.params.id
    let user=await User.findById(userId)

  

    if(!user){
      return res.status(401).json({
        message: 'User not found',
        success: false,})
    }

     //populating user before sendng
     user = await User.findById(user._id)
     .populate({ path: "posts" })
     .select("-password");

     

     return res.status(200).json({
      success:true,
      user
     })


  } catch (error) {
     console.log(error)
  }
}