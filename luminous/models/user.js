const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
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
    // status: {
    //   type: String,
    //   enum: {
    //     values: ["active", "inactive"],
    //     message: "status can only be active or inactive!!",
    //   },
    // },
    // permitions: {
    //   type: String,
    //   enum: ["read", "write", "delete"],
    // },
    salt: {
      type: String,
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

// Password hashing middleware before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = randomBytes(16).toString();
    const hexcode = createHmac("sha512", salt)
      .update(this.password)
      .digest("hex");
    this.salt = salt;
    this.password = hexcode;
  }
  next();
});

// Method to compare passwords during login
userSchema.static("isRightUser", async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    return { message: "wrong username." };
  }
  const salt = user.salt;
  const hexcode = createHmac("sha512", salt).update(password).digest("hex");
  if (hexcode === user.password) {
    return user;
  } else {
    return { message: "wrong password." };
  }
});

userSchema.post("findOneAndDelete", async (user) => {
  const result = await Listing.deleteMany({ createdBy: user._id });
  console.log(result);
});

userSchema.pre("deleteMany", async () => {
  const result = await Listing.deleteMany({});
  console.log(result);
});

const User = model("User", userSchema);

module.exports = User;
