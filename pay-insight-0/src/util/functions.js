import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

if (process.env.NODE_ENV != "development") {
  configDotenv();
}
const mapToken = process.env.MAPBOX_DEFAULT_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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

export const formatDateForComparison = (dateObj) => {
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// Function to reverse geocode (coordinates to address)
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await geocodingClient
      .reverseGeocode({ query: [longitude, latitude] })
      .send();
    const result = response.body;

    if (result && result.features && result.features.length > 0) {
      console.log("Address:", result.features[0].place_name);
      return result.features[0].place_name;
    } else {
      console.log("No address found for these coordinates.");
    }
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
  }
  return null;
};
