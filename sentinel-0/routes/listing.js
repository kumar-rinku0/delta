const { Router } = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrap-async.js");

const { onlyLoggedInUser, isLoggedInCheck } = require("../middlewares/auth.js");
const {
  handleDeleteListing,
  handleCreateListing,
  handleShowUsernameListings,
  handleShowOneListing,
  handleUpdateLising,
  handleShowListings,
} = require("../controllers/listing.js");
const { handleCreateReview } = require("../controllers/review.js");
const { handleUpdateReview } = require("../middlewares/listing.js");
const multer = require("multer");
const { multerStorage } = require("../utils/cloud-init");
const upload = multer({ storage: multerStorage });

const route = Router();

// async function are wrappred.
route.get("/", wrapAsync(handleShowListings));

route.get("/create", onlyLoggedInUser, (req, res) => {
  let user = req.user;
  return res
    .status(200)
    .render("create-listing.ejs", { title: "new listing...", user });
});

route.get(
  "/user/:username",
  onlyLoggedInUser,
  wrapAsync(handleShowUsernameListings)
);

// creating new listing
route.post(
  "/create",
  onlyLoggedInUser,
  upload.single("listing[image]"),
  wrapAsync(handleCreateListing)
);

// unprotected route.
route
  .route("/:id")
  .get(wrapAsync(handleShowOneListing))
  .post(
    onlyLoggedInUser,
    wrapAsync(handleUpdateReview),
    wrapAsync(handleCreateReview)
  );

route
  .route("/:id/edit")
  .get(onlyLoggedInUser, async (req, res) => {
    let user = req.user;
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const imageUrl = listing.image.url.replace("/upload", "/upload/w_200");
    return res.status(200).render("edit-listing.ejs", {
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
