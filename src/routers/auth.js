const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { User } = require("../models/user");

const { validateSignUpUser } = require("../utils/helper");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpUser(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await userObj.save();
    const token = savedUser.getJWT();
    res.cookie("token", token);
    res.json({ message: "User signed up successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Email ID is invalid");
    }

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error("Invalid Credentials");
    const token = user.getJWT();
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("Successfully Logged Out");
});

module.exports = {
  authRouter,
};
