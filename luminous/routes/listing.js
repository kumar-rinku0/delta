const { Router } = require("express");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/express-error.js");
const wrapAsync = require("../utils/wrap-async.js");
const route = Router();

route.get("/wrong", (req, res) => {
  abcd = abcd;
});

route.get("/new", (req, res) => {
  res.status(200).render("newListing.ejs", { title: "new listing..." });
});

// async function are wrappred.
route.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res
      .status(200)
      .render("listings.ejs", { listings, title: "All listings!!" });
  })
);

route.post(
  "/new",
  wrapAsync(async (req, res) => {
    const { listing } = req.body;
    const newListing = new Listing(listing);
    await newListing.save();
    res.status(200).redirect("/listings");
  })
);

route.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (id.toString().length != 24) {
      next(new ExpressError(400, "Listing id is incorrect!!"));
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      // throw new ExpressError(404, "Listing Not Found!!");  // async fuction can throw errors this only if they are wrapped with async_wrapper.
      next(new ExpressError(404, "Listing not Found!!"));
    }
    res
      .status(200)
      .render("listing.ejs", { listing, title: "listing based on title" });
  })
);

module.exports = route;
