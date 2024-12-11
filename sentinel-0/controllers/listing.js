const Listing = require("../models/listing");
const User = require("../models/user");
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
  const { listing } = req.body;
  const response = await geocodingClient
    .forwardGeocode({
      query: `${listing.location.value} ${listing.location.country}`,
      limit: 1,
    })
    .send();
  const geometry = response.body.features[0].geometry;
  const { filename, path: url } = req.file;
  let user = req.user;
  const newListing = new Listing(listing);
  newListing.image = { filename, url };
  newListing.createdBy = user._id;
  newListing.location.geometry = geometry;
  await newListing.save();
  return res.status(201).send({ type: "success", msg: "listing saved!" });
};

const handleUpdateLising = async (req, res) => {
  let user = req.user;
  const { listing } = req.body;
  const filename = req?.file?.filename;
  const url = req?.file?.path;
  const { id } = req.params;
  if (id.length != 24) {
    return res
      .status(400)
      .send({ type: "error", msg: "invalid listing info!" });
  }
  const newListing = await Listing.findById(id);
  newListing.title = listing.title;
  newListing.description = listing.description;
  newListing.price = listing.price;
  if (newListing.location.value !== listing.location.value) {
    newListing.location.value = listing.location.value;
    newListing.location.country = listing.location.country;
    const response = await geocodingClient
      .forwardGeocode({
        query: `${listing.location.value} ${listing.location.country}`,
        limit: 1,
      })
      .send();
    const geometry = response.body.features[0].geometry;
    newListing.location.geometry = geometry;
  }
  newListing.image = filename && url ? { filename, url } : newListing.image;
  await newListing.save();
  return res.status(200).send({ type: "success", msg: "listing updated!" });
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
      .send({ type: "error", msg: "listing id is incoorect!!" });
  }
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    return res
      .status(400)
      .send({ type: "error", msg: "incorrect listing id!" });
  }
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
