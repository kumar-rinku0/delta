const Review = require("../models/review");
const Listing = require("../models/listing");

const handleCreateReview = async (req, res) => {
  let user = req.user;
  const { id } = req.params;
  const { rating, msg } = req.body;
  const listing = await Listing.findById(id);

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

module.exports = {
  handleCreateReview,
};
