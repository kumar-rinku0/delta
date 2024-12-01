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
  handleUpdateLising,
} = require("../controllers/listing.js");
const multer = require("multer");
const { cloudUpload, multerStorage } = require("../utils/cloud-init");
const upload = multer({ storage: multerStorage });

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

route.get("/create", onlyLoggedInUser, (req, res) => {
  let user = req.user;
  res
    .status(200)
    .render("create-listing.ejs", { title: "new listing...", user });
});

route.get(
  "/user/:username",
  onlyLoggedInUser,
  wrapAsync(handleReadUsernameListing)
);

// creating new listing
route.post(
  "/create",
  onlyLoggedInUser,
  upload.single("listing[image]"),
  wrapAsync(handleCreateLising)
);

// unprotected route.
route
  .route("/:id")
  .get(wrapAsync(handleReadListing))
  .post(onlyLoggedInUser, wrapAsync(handlePostReview));

route
  .route("/:id/edit")
  .get(onlyLoggedInUser, async (req, res) => {
    let user = req.user;
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const imageUrl = listing.image.url.replace("/upload", "/upload/w_200");
    res.status(200).render("edit-listing.ejs", {
      title: "edit listing...",
      user,
      listing,
      imageUrl,
    });
  })
  .post(
    onlyLoggedInUser,
    upload.single("listing[image]"),
    wrapAsync(handleUpdateLising)
  );

// post route for deleting listing.
route.post("/:id/:createdBy", onlyLoggedInUser, wrapAsync(handleDeleteListing));

module.exports = route;
