const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

//  @desc       Register New User
// @route       POST api/users
// @access      public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exist");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // res.json({message: 'Register User'})
});

//  @desc       Login autentikasi
// @route       POST api/users/login
// @access      public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

//  @desc       Get User Data
// @route       GET api/users/me
// @access      private
const getMe = asyncHandler(async (req, res) => {
  // const {_id, name, email} = await User.findById(req.user.id)

  res.status(200).json(req.user);
});

// Check token if expired
const checkToken = (req, res, next) => {
  let token;
  let dateNow = new Date();
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const jwttoken = jwt.verify(token, process.env.JWT_SECRET);

      let jwtExp = new Date(jwttoken.exp * 1000); // Convert kembali date

      isExpiredToken = jwttoken.exp > dateNow.getTime() / 1000 ? true : false;

      return res
        .status(200)
        .json({ isExpiredToken: isExpiredToken, exp: jwtExp });
    } else {
      console.log(token);
    }
  } catch (error) {
    console.log(error);
  }
};

// Genereate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  checkToken,
};
