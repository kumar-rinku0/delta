const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
const ExpressError = require("../utils/express-error");

const handleUpdateReview = async (req, res, next) => {
  let user = req.user;
  const { id } = req.params;
  const { rating, msg } = req.body;
  if (id.toString().length != 24) {
    req.flash("error", "listing id incorrect!!");
    return res.status(201).redirect("/listings");
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not Found!!");
    return res.status(201).redirect("/listings");
  }
  if (!rating || rating <= 0 || rating >= 6) {
    req.flash("error", "No vailid rating stars provided!!");
    return res.status(201).redirect(`/listings/${listing._id}`);
  }
  if (listing.createdBy.toString() === user._id.toString()) {
    req.flash("error", "You can't rate your own listing!!");
    return res.status(201).redirect(`/listings/${listing._id}`);
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
    req.flash("success", "Review Updated!!");
    return res.status(201).redirect(`/listings/${listing._id}`);
  }
  if (!msg.trim()) {
    req.flash("error", "No msg provided!!");
    return res.status(201).redirect(`/listings/${listing._id}`);
  }
  return next();
};

module.exports = {
  handleUpdateReview,
};
