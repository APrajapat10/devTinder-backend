const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: { required: true, type: mongoose.Schema.ObjectId, ref: "User" },
    toUserId: { required: true, type: mongoose.Schema.ObjectId, ref: "User" },
    status: {
      required: true,
      type: String,
      values: ["interested", "ignored", "accepted", "rejected"],
      message: `{VALUE} is not supported`,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId))
    throw new Error("Cannot send request to yourself");
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = {
  ConnectionRequest,
};
