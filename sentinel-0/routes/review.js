const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { handleCreateReview } = require("../controllers/review.js");
const { handleUpdateReview } = require("../middlewares/listing.js");

const { Router } = require("express");
const wrapAsync = require("../utils/wrap-async.js");

const route = Router();

route
  .route("/:id")
  .post(wrapAsync(handleUpdateReview), wrapAsync(handleCreateReview));

route.delete(
  "/:id/:reviewId",
  wrapAsync(async (req, res) => {
    console.log(req.params);
    const { id, reviewId } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        $pull: { reviews: reviewId },
      },
      { new: true }
    ).populate("reviews");
    console.log(listing);
    const review = await Review.findByIdAndDelete(reviewId);
    res.status(200).send({
      type: "success",
      msg: "review pruned!",
      deletedReview: review,
      updatedListing: listing,
    });
  })
);

module.exports = route;
