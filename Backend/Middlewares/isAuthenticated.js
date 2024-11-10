const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = await req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication Token not found.",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid user",
        success: false,
      });
    }

    // if user is authenticated we are adding userId into req so that we can easily access that user
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

