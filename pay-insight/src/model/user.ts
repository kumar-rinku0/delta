import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

function generateUsername() {
  const timestamp = Date.now(); // Get current timestamp
  return `user_${timestamp}`;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: generateUsername,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin"],
        message: "role must be user or admin.",
      },
    },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "blocked"],
        message: "status must be active or blocked.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: String,
    resetToken: String,
    verifyTokenExpire: Date,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hexcode = await bcrypt.hash(this.password.trim(), salt);
    this.password = hexcode;
  }
  next();
});

userSchema.statics.isRightUser = async function (
  email: string,
  password: string
) {
  const user = await User.findOne({ email }).exec();
  if (!user) {
    return { message: "wrong email." };
  }
  const isOk = await bcrypt.compare(password, user.password);
  if (!isOk) {
    return { message: "wrong password." };
  }
  if (user.role !== "admin" && user.status !== "active") {
    return { message: "blocked by admin!!" };
  }
  return user;
};

const User = mongoose.models.User || model("User", userSchema);

export default User;
