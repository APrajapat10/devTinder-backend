const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../utils/constants");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Token not Present, Please Login!");
    }
    const decodedObj = jwt.verify(token, jwtSecretKey);
    const { id } = decodedObj;
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
};

module.exports = {
  userAuth,
};
