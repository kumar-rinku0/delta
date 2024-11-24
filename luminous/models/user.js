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
    role: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: ["local", "admin"],
        message: "invailid role!",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "status can only be active or inactive!!",
      },
    },
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
  if (hexcode !== user.password) {
    return { message: "wrong password." };
  }
  if (user.role !== "admin" && user.status !== "active") {
    return { message: "blocked by admin!!" };
  }
  return user;
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
