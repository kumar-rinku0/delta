const Listing = require("../models/listing");
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const ExpressError = require("../utils/express-error");

// geocoding
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_DEFULT_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

// post review

const handleDeleteListing = async (req, res) => {
  const { id, createdBy } = req.params;
  if (id.length != 24 || createdBy.length != 24) {
    return res.status(401).send({ type: "error", msg: "incorrect listing!!" });
  }
  let user = req.user;
  // const listing = await Listing.findById(id);
  if (user._id.toString() !== createdBy) {
    return res
      .status(401)
      .send({ type: "error", msg: "unauthorized pruning!!" });
  }
  await Listing.findByIdAndDelete(id);
  return res.status(200).send({ type: "success", msg: "listing pruned!!" });
};

const handleCreateListing = async (req, res) => {
  const { title, description, location, country, price } = req.body;
  const response = await geocodingClient
    .forwardGeocode({
      query: `${location} ${country}`,
      limit: 1,
    })
    .send();
  const geometry = response.body.features[0].geometry;
  const { filename, path } = req.file;
  let user = req.user;
  const newListing = new Listing({
    title,
    description,
    price,
  });
  const url = path.replace(
    "/upload",
    "/upload/f_auto/c_fill,g_auto,h_480,w_720/w_320"
  );
  newListing.image = { filename, url };
  newListing.createdBy = user._id;
  newListing.location = { value: location, country, geometry };
  await newListing.save();
  return res.status(201).send({ type: "success", msg: "listing saved!" });
};

const handleUpdateLising = async (req, res) => {
  const { listing } = req.body;
  const filename = req?.file?.filename;
  const path = req?.file?.path;
  const { id } = req.params;
  if (id.length != 24) {
    return res
      .status(400)
      .send({ type: "error", msg: "invalid listing info!" });
  }
  const oldListing = await Listing.findById(id);
  oldListing.title = listing.title;
  oldListing.description = listing.description;
  oldListing.price = listing.price;
  if (oldListing.location.value !== listing.location.value) {
    oldListing.location.value = listing.location.value;
    oldListing.location.country = listing.location.country;
    const response = await geocodingClient
      .forwardGeocode({
        query: `${listing.location.value} ${listing.location.country}`,
        limit: 1,
      })
      .send();
    const geometry = response.body.features[0].geometry;
    oldListing.location.geometry = geometry;
  }
  if (filename && path) {
    const url = path.replace(
      "/upload",
      "/upload/f_auto/c_fill,g_auto,h_480,w_720/w_320"
    );
    oldListing.image = { filename, url };
  } else {
    oldListing.image = oldListing.image;
  }
  // updating old listing with new values!
  await oldListing.save();
  oldListing.image.url = oldListing.image.url.replace("/w_320", "q_auto");
  return res
    .status(200)
    .send({ type: "success", msg: "listing updated!", listing: oldListing });
};

const handleShowUsernameListings = async (req, res) => {
  let user = req.user;
  const { username } = req.params;
  if (username !== user.username.toString()) {
    return res
      .status(401)
      .send({ type: "error", msg: "bad req! incorrect username." });
  }
  let listings = await Listing.find({ createdBy: user._id }).sort({
    createdAt: -1,
  });
  return res.status(200).send({
    listings,
    myListings: true,
    title: "my listings!!",
  });
};

const handleShowListings = async (req, res) => {
  let listings = await Listing.find({}).sort({ createdAt: -1 });
  return res.status(200).send({
    listings,
    myListings: false,
    title: "listings!!!",
  });
};

const handleShowOneListing = async (req, res) => {
  let user = req.user || null;
  const { id } = req.params;
  if (id.toString().length != 24) {
    return res
      .status(400)
      .send({ type: "error", msg: "listing id is incorrect!!" });
  }
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    return res
      .status(400)
      .send({ type: "error", msg: "incorrect listing id!" });
  }
  listing.image.url = listing.image.url.replace(
    "/c_fill,g_auto,h_480,w_720/w_320",
    "/q_auto"
  );
  const listingCreatedBy = await User.findById(listing.createdBy);
  if (user && listing.createdBy === user._id) {
    listingCreatedBy = null;
  }
  return res.status(200).send({
    listing,
    accessToken: process.env.MAPBOX_DEFULT_TOKEN,
    listingCreatedBy,
  });
};

module.exports = {
  handleDeleteListing,
  handleShowUsernameListings,
  handleCreateListing,
  handleUpdateLising,
  handleShowOneListing,
  handleShowListings,
};
