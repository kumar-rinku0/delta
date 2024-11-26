const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
const ExpressError = require("../utils/express-error");

// post review
const handlePostReview = async (req, res) => {
  let user = req.user;
  const { id } = req.params;
  const { rating, msg } = req.body;
  if (id.toString().length != 24) {
    throw new ExpressError(400, "Listing id is incorrect!!");
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not Found!!");
  }
  if (listing.createdBy.toString() === user._id.toString()) {
    throw new ExpressError(403, "You can't rate your own listing!!");
  }
  const popListing = await Listing.findById(id).populate("reviews");
  const reviews = popListing.reviews.filter((value) => {
    return value.username === user.username;
  });
  if (reviews[0] && (rating || msg)) {
    const review = reviews[0];
    review.rating = rating || review.rating;
    review.msg = msg || review.msg;
    await review.save();
    return res.status(201).redirect(`/listings/${listing._id}`);
  }
  if (!rating) {
    throw new ExpressError(400, "Bad Req!! No rating stars provided.");
  }
  if (!msg.trim()) {
    throw new ExpressError(400, "Bad Req!! No msg.");
  }
  const review = new Review({
    rating,
    msg,
    username: user.username,
  });
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  return res.status(201).redirect(`/listings/${listing._id}`);
};

const handleDeleteListing = async (req, res) => {
  const { id, createdBy } = req.params;
  if (id.length != 24 || createdBy.length != 24) {
    throw new ExpressError(400, "Incorrect listing!!");
  }
  let user = req.user;
  // const listing = await Listing.findById(id);
  if (user._id.toString() !== createdBy) {
    throw new ExpressError(401, "Unauthorized pruning!!");
  }
  await Listing.findByIdAndDelete(id);
  throw new ExpressError(200, "Listing pruned!!");
};

const handleCreateLising = async (req, res) => {
  const { listing } = req.body;
  let user = req.user;
  const newListing = new Listing(listing);
  newListing.createdBy = user._id;
  await newListing.save();
  res.status(200).redirect("/listings");
};

const handleReadUsernameListing = async (req, res) => {
  let user = req.user;
  const { username } = req.params;
  if (username !== user.username.toString()) {
    throw new ExpressError(400, "Bad Requiest!! incorrect username!");
  }
  const listings = await Listing.find({ createdBy: user._id }).sort({
    createdAt: -1,
  });
  res.status(200).render("listings.ejs", {
    listings,
    user,
    myListings: true,
    title: "my listings!!",
  });
};

const handleReadListing = async (req, res) => {
  let user = req.user || null;
  const { id } = req.params;
  if (id.toString().length != 24) {
    throw new ExpressError(400, "Listing id is incorrect!!");
  }
  const listing = await Listing.findById(id).populate("reviews");
  const listingCreatedBy = await User.findById(listing.createdBy);
  if (user && listing.createdBy === user._id) {
    listingCreatedBy = null;
  }
  if (!listing) {
    // throw new ExpressError(404, "Listing Not Found!!");  // async fuction can throw errors this only if they are wrapped with async_wrapper.
    throw new ExpressError(404, "Listing not Found!!");
  }
  res.status(200).render("listing.ejs", {
    listing,
    user,
    listingCreatedBy,
    title: "listing based on title",
  });
};

module.exports = {
  handlePostReview,
  handleDeleteListing,
  handleReadUsernameListing,
  handleCreateLising,
  handleReadListing,
};
