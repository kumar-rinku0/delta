const { Router } = require("express");
const Listing = require("../models/listing.js");
const route = Router();

route.get("/", async (req, res) => {
  const listings = await Listing.find({});
  res.status(200).render("listings.ejs", { listings, title: "All listings!!" });
});

route.get("/new", (req, res) => {
  res.status(200).render("newListing.ejs", { title: "new listing..." });
});

route.post("/new", async (req, res) => {
  const { listing } = req.body;
  const newListing = new Listing(listing);
  await newListing.save();
  res.status(200).redirect("/listings");
});

route.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res
    .status(200)
    .render("listing.ejs", { listing, title: "listing based on title" });
});

module.exports = route;
