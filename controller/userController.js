const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodb");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");


// CREATE USER
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // CREATE USER
    const newUser = await User.create(req.body);
    res.json({
      message: "User created successfully",
      status: true,
      newUser,
    });
  } else {
    //USER ALREADY EXIST
    throw new Error("User already exist");
  }
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // CHECK IF USER EXIST OR NOT
  const findUser = await User.findOne({ email });
  // console.log('id', findUser._id);
  validateMongoDbId(findUser._id)
  
  if (findUser && (await findUser.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    )
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        maxAge : 72*60*60*1000,
    })
    res.json({
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

// HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if(!cookies.refreshToken) throw new Error("No Refresh Token in Cookies")

  const refreshToken = cookies.refreshToken
  const user = await User.findOne({ refreshToken })
  
  if(!user) throw new Error("No Refresh Token in DB")
    jwt.verify(refreshToken, process.env.JWT_KEY, (err, decoded) => {
      if(err || user._id.toString() !== decoded._id) {
        throw new Error ("Refresh token error")
      }
      const accessToken = generateRefreshToken(user._id)
      res.json({accessToken})
    })
  });

  // LOGOUT USER
  const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookies.refreshToken
    const user = await User.findOne({ refreshToken })
    if(!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
      })
      return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken}, {
      refreshToken: ''
    })
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true
    })
    res.sendStatus(204)
  })

// UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});


// GET ALL USER
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// GET SINGLE USER
const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const getUser = await User.findById(_id);
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const deleteUser = await User.findByIdAndDelete(_id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

// BLOCK USER
const blockUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      _id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json(blockUser);
  } catch (error) {
    throw new Error(error);
  }
});

// UNBLOCK USER
const unBlockUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const unBlockUser = await User.findByIdAndUpdate(
      _id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json(unBlockUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout
};
