// ✅ Logics.js
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

const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, fitnessGoal } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    let passwordenc = bcrypt.hashSync(password, 12);
    const newUser = new User({ name, email, password: passwordenc, age, gender, height, weight, fitnessGoal });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });

    let Email_Body = {
      to: email,
      from: process.env.EMAIL,
      Subject: "Registered Successfully",
      html: `<h3>Hi ${name}<br/><br/> your Account has been resgistered successfully, Congragulations.<br/>
        <a href='http://localhost:3002/web/i'>Continue on Website</a></h3>`
    };
    email_info.sendMail(Email_Body, (error, info) => error ? console.log(error.message) : console.log("Email sent"));
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: "Invalid email or password" });

    let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", user: { tokenid: token, username: user.name, email: user.email, id: user.id } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

    email_info.sendMail(Email_Body, (e, i) => e ? res.status(501).json({ msg: e.message }) : res.status(200).json({ msg: "Password reset link sent" }));
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ msg: error.message });
  }
};

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

module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  forgot_pswd,
  resetPassword,
};
