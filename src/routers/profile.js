const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditUser } = require("../utils/helper");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditUser) throw new Error("Invalid Details Entered");

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = {
  profileRouter,
};
