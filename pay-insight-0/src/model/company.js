import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    companyCode: {
      type: String,
      required: true,
      unique: true,
      default: () => generateRandomString(5),
    },
    cinNo: String,
    gstNo: String,
    companyAddress: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
