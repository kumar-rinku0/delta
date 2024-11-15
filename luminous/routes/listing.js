const { Router } = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/express-error.js");
const wrapAsync = require("../utils/wrap-async.js");
const route = Router();

route.get("/wrong", (req, res) => {
  abcd = abcd;
});

route.get("/new", (req, res) => {
  let user = req.user;
  res.status(200).render("newListing.ejs", { title: "new listing...", user });
});

// async function are wrappred.
route.get(
  "/",
  wrapAsync(async (req, res) => {
    let user = req.user;
    const listings = await Listing.find({});
    res
      .status(200)
      .render("listings.ejs", { listings, user, title: "All listings!!!" });
  })
);

route.get(
  "/user/:username",
  wrapAsync(async (req, res) => {
    let user = req.user;
    const { username } = req.params;
    if (username !== user.username.toString()) {
      throw new ExpressError(400, "Bad Requiest!! incorrect username!");
    }
    const listings = await Listing.find({ createdBy: user._id });
    res
      .status(200)
      .render("listings.ejs", { listings, user, title: "my listings!!" });
  })
);

route.post(
  "/new",
  wrapAsync(async (req, res) => {
    const { listing } = req.body;
    let user = req.user;
    const newListing = new Listing(listing);
    newListing.createdBy = user._id;
    await newListing.save();
    res.status(200).redirect("/listings");
  })
);

route.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let user = req.user;
    const { id } = req.params;
    if (id.toString().length != 24) {
      throw new ExpressError(400, "Listing id is incorrect!!");
    }
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      // throw new ExpressError(404, "Listing Not Found!!");  // async fuction can throw errors this only if they are wrapped with async_wrapper.
      throw new ExpressError(404, "Listing not Found!!");
    }
    res.status(200).render("listing.ejs", {
      listing,
      user,
      title: "listing based on title",
    });
  })
);

route.post(
  "/:id/review",
  wrapAsync(async (req, res) => {
    let user = req.user;
    const { id } = req.params;
    const { rating, msg } = req.body;
    console.log(req.body);
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
    const review = new Review({
      rating,
      msg,
      username: user.username,
    });
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.status(200).render("listing.ejs", {
      listing,
      user,
      title: "listing based on title",
    });
  })
);

// post route for deleting listing.
route.post(
  "/:id/:createdBy",
  wrapAsync(async (req, res) => {
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
    // res.status(200).redirect("/listing");
  })
);

module.exports = route;
