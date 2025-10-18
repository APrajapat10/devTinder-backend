const mongoose = require("mongoose");
const { defaultPhotoUrl } = require("../utils/constants");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email Address");
      },
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18, max: 50 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "Male", "female", "Female", "others"].includes(value)) {
          throw new Error("Gender validation failed");
        }
      },
    },
    photoUrl: {
      type: String,
      default: defaultPhotoUrl,
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Invalid photoUrl");
      },
    },
    about: { type: String, default: "This is the default about of the user" },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.jwtSecretKey, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
