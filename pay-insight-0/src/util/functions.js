import User from "../model/user.js";
import bcrypt from "bcryptjs";

export const isRightUser = async function (email, password) {
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return { message: "wrong email address.", status: 400 };
  }
  const isOk = await bcrypt.compare(password.trim(), user.password);
  if (!isOk) {
    return { message: "wrong password.", status: 401 };
  }
  if (!user.isVerified) {
    return { message: "please verify your email.", status: 406 };
  }
  // if (user.role !== "admin" && user.status !== "active") {
  //   return { message: "blocked by admin!!", status: 403 };
  // }
  return user;
};

export function generateRandomString(length, includeNumeric = true) {
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

export const currntTimeInFixedFomat = (currDate, delay) => {
  const currentDate = new Date(currDate + delay * 60 * 1000);
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};
