const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user;
      const status = req.params.status;
      const toUserId = req.params.toUserId;

      const allowedStatus = ["interested", "ignored"]; // Right swipe, Left swipe
      if (!allowedStatus.includes(status)) throw new Error("Invalid Status");

      const userInDB = await User.findById(toUserId);
      if (!userInDB) throw new Error("User doesn't exist");
      const existingConnectionRequestObj = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequestObj)
        throw new Error("Connection request already exists");
      const connectionRequestObj = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestObj.save();
      res.json({
        message: `${req.user.firstName} ${status} ${userInDB.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) throw new Error("Invalid Status");
      const existingConnectionRequestObj = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      });
      if (!existingConnectionRequestObj)
        throw new Error("Connection Request not found");

      existingConnectionRequestObj.status = status;
      await existingConnectionRequestObj.save();

      res.json({
        message: "Connection Request " + status,
        data: existingConnectionRequestObj,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  }
);
module.exports = {
  requestRouter,
};
