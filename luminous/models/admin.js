const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const Listing = require("./listing.js");

const adminSchema = new Schema(
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
adminSchema.pre("save", async function (next) {
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
adminSchema.static("isRightUser", async (username, password) => {
  const user = await Admin.findOne({ username });
  if (!user) {
    return { message: "wrong admin username." };
  }
  const salt = user.salt;
  const hexcode = createHmac("sha512", salt).update(password).digest("hex");
  if (hexcode === user.password) {
    return user;
  } else {
    return { message: "wrong admin password." };
  }
});

adminSchema.post("findOneAndDelete", async (user) => {
  const result = await Listing.deleteMany({ createdBy: user._id });
  console.log(result);
});

adminSchema.pre("deleteMany", async () => {
  const result = await Listing.deleteMany({});
  console.log(result);
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;
