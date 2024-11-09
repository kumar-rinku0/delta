require("dotenv").config();

const express = require("express");
const path = require("path");
const connection = require("./utils/init.js");
const Listing = require("./models/listing.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

connection();

app.get("/", (req, res) => {
  res.status(200).send("OK!");
});

app.get("/listings", async (req, res) => {
  const listings = await Listing.find({});
  res.status(200).render("listings.ejs", { listings });
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.status(200).render("listing.ejs", { listing });
});

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
