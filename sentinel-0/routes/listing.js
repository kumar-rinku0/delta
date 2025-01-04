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
  upload.single("image"),
  wrapAsync(handleCreateListing)
);

// unprotected route.
route.route("/:id").get(wrapAsync(handleShowOneListing));

route
  .route("/:id/edit")
  .get(onlyLoggedInUser, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    listing.image.url = listing.image.url.replace("q_auto", "w_320");
    return res.status(200).send({
      type: "success",
      msg: "listing send!",
      listing,
    });
  })
  .post(
    onlyLoggedInUser,
    upload.single("image"),
    wrapAsync(handleUpdateLising)
  );

// post route for deleting listing.
route.post("/:id/:createdBy", onlyLoggedInUser, wrapAsync(handleDeleteListing));

module.exports = route;
