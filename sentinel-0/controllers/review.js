const Review = require("../models/review");
const Listing = require("../models/listing");

const handleCreateReview = async (req, res) => {
  let user = req.user;
  const { id } = req.params;
  const { rating, msg } = req.body;
  const listing = await Listing.findById(id).populate("reviews");

  const review = new Review({
    rating,
    msg,
    username: user.username,
  });
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  return res
    .status(200)
    .send({ type: "success", msg: "review created!", listing: listing });
};

module.exports = {
  handleCreateReview,
};
