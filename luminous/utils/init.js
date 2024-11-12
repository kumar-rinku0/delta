const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const sampleListings = require("./data.js");
const MONGO_URI = process.env.MONGO_URI;

const connection = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("connected with database!!"))
    .catch((err) => console.error(err));
};

const init = async () => {
  connection();
  const result1 = await Listing.deleteMany({});
  console.log(result1);
  const result = await Listing.insertMany(sampleListings.data);
  console.log(result);
};

// init();

module.exports = connection;