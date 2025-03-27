import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      default: () => generateRandomString(5),
    },
    cin: String,
    gst: String,
    logo: String,
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: String,
    type: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    branches: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 1,
    },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);

export default Company;

function generateRandomString(length, includeNumeric = true) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeric = "0123456789";

  let characters = alphabet;
  if (includeNumeric) {
    characters += numeric;
  }

  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}
