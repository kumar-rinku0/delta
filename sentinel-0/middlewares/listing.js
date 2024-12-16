const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
const ExpressError = require("../utils/express-error");

const handleUpdateReview = async (req, res, next) => {
  let user = req.user;
  const { id } = req.params;
  const { rating, msg } = req.body;
  if (id.toString().length != 24) {
    return res
      .status(400)
      .send({ type: "error", msg: "listing id incorrect!!" });
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(400).send({ type: "error", msg: "Listing not found!" });
  }
  if (!rating || rating <= 0 || rating >= 6) {
    return res
      .status(400)
      .send({ type: "error", msg: "No rating stars provided!!" });
  }
  if (listing.createdBy.toString() === user._id.toString()) {
    return res
      .status(400)
      .send({ type: "error", msg: "can't rate own listings!" });
  }
  const popListing = await Listing.findById(id).populate("reviews");
  const reviews = popListing.reviews.filter((value) => {
    return value.username === user.username;
  });
  if (reviews[0] && (rating || msg.trim())) {
    const review = reviews[0];
    review.rating = rating || review.rating;
    review.msg = msg.trim() || review.msg;
    await review.save();
    return res
      .status(201)
      .send({ type: "success", msg: "Review Updated!", listing: popListing });
  }
  if (!msg.trim()) {
    return res.status(400).send({ type: "error", msg: "No msg provided!" });
  }
  return next();
};

module.exports = {
  handleUpdateReview,
};
