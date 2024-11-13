const { Schema, model } = require("mongoose");
const Listing = require("./listing.js");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.post("findOneAndDelete", async (user) => {
  await Listing.deleteMany({ createdBy: user._id });
});

const User = model("User", userSchema);

module.exports = User;
