import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    // role: {
    //   type: String,
    //   required: true,
    //   default: "admin",
    //   trim: true,
    //   enum: {
    //     values: ["admin", "manager", "employee"],
    //     message: "invailid role!",
    //   },
    // },
    companyWithRole: {
      type: [
        {
          role: {
            type: String,
          },
          company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            unique: true,
          },
        },
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: String,
    verifyTokenExpire: Date,
    resetToken: String,
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

const User = model("User", userSchema);

export default User;
