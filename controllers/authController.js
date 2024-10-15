const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send(`All fields are required`);
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.status(400).send(`User already exists with this email`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send(`All fields are required`);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send(`User not found`);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).send(`Incorrect Password`);
    }

    const accessToken = generateAccessToken({
      id: user._id,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
  }
};

// this api aill check the refreshToken validity and genrate a new access token
const refreshAccessTokenController = async (req, res) => {
  // const { refreshToken } = req.body;
  const cookies = req.cookies;
  if(!req.cookies.jwt){
    return res.status(401).send("Refresh token in cookies is required"); 
  }

  const refreshToken = cookies.jwt;

  // if (!refreshToken) {
  //   return res.status(401).send("refresh token required");
  // }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    if (!decoded) {
      return res.status(403).send("Invalid refresh key");
    }

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });

    return res.status(201).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(403).send("Invalid refresh key");
  }
};

//internal function
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "60s",
    });

    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });

    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
};
