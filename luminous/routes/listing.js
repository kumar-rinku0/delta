const { Router } = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/express-error.js");
const wrapAsync = require("../utils/wrap-async.js");
const User = require("../models/user.js");
const { onlyLoggedInUser, isLoggedInCheck } = require("../middlewares/auth.js");
const {
  handlePostReview,
  handleDeleteListing,
  handleCreateLising,
  handleReadUsernameListing,
  handleReadListing,
} = require("../controllers/listing.js");

const route = Router();

// async function are wrappred.
route.get(
  "/",
  wrapAsync(async (req, res) => {
    let user = req.user || null;
    let listings = await Listing.find({}).sort({ createdAt: -1 });
    res.status(200).render("listings.ejs", {
      listings,
      myListings: false,
      user,
      title: "listings!!!",
    });
  })
);

route.get("/new", onlyLoggedInUser, (req, res) => {
  let user = req.user;
  res.status(200).render("newListing.ejs", { title: "new listing...", user });
});

route.get(
  "/user/:username",
  onlyLoggedInUser,
  wrapAsync(handleReadUsernameListing)
);

route.post("/new", onlyLoggedInUser, wrapAsync(handleCreateLising));
// unprotected route.
route.get("/:id", wrapAsync(handleReadListing));
// post req. for review model
route.post("/:id", onlyLoggedInUser, wrapAsync(handlePostReview));
// post route for deleting listing.
route.post("/:id/:createdBy", onlyLoggedInUser, wrapAsync(handleDeleteListing));

module.exports = route;
