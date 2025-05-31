const User = require("../Models/Users");
let bcrypt = require("bcrypt");
let nodemailer = require("nodemailer");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
require("dotenv").config();

let email_info = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY,
  },
});

const tokenMap = new Map();

// ✅ Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, fitnessGoal } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    let passwordenc = bcrypt.hashSync(password, 12);
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    const newUser = new User({
      name,
      email,
      password: passwordenc,
      age,
      gender,
      height,
      weight,
      fitnessGoal,
      bmi: parseFloat(bmi.toFixed(2))
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });

    let Email_Body = {
      to: email,
      from: process.env.EMAIL,
      subject: "Registered Successfully",
      html: `<h3>Hi ${name}<br/><br/> your Account has been registered successfully, Congratulations.<br/>
        <a href='http://localhost:3002/web/i'>Continue on Website</a></h3>`
    };
    email_info.sendMail(Email_Body, (error, info) => error ? console.log(error.message) : console.log("Email sent"));
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: "Invalid email or password" });

    let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({
      message: "Login successful",
      user: {
        tokenid: token,
        username: user.name,
        email: user.email,
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Forgot Password
const forgot_pswd = async function (req, res) {
  try {
    let { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email doesn't exist" });

    let token = crypto.randomBytes(20).toString("hex");
    tokenMap.set(token, email);
    let link = `http://localhost:3002/reset-password/${token}`;

    let Email_Body = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Reset your password",
      html: `Hi ${user.name},<br/>Click the link to reset your password:<br/><a href="${link}">${link}</a>`
    };

    email_info.sendMail(Email_Body, (e, i) => e
      ? res.status(501).json({ msg: e.message })
      : res.status(200).json({ msg: "Password reset link sent" }));
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ msg: error.message });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    const email = tokenMap.get(token);

    if (!email) return res.status(400).json({ msg: "Invalid or expired token" });

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = bcrypt.hashSync(password, 12);
    await user.save();

    tokenMap.delete(token);
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
};

// ✅ Get User Profile (BMI info)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("height weight bmi");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update User height/weight and recalculate BMI
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { height, weight } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.height = height;
    user.weight = weight;

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    user.bmi = parseFloat(bmi.toFixed(2));

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", bmi: user.bmi });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Export All Functions
module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  forgot_pswd,
  resetPassword,
  getUserProfile,
  updateUserProfile,
};
