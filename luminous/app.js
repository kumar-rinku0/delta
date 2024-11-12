require("dotenv").config();

const express = require("express");
const path = require("path");
const connection = require("./utils/init.js");
const Listing = require("./models/listing.js");
const listingRouter = require("./routes/listing.js");
const ExpressError = require("./utils/express-error.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

connection();

app.get("/", (req, res) => {
  res.status(200).redirect(`/listings`);
});

app.get("/admin", (req, res) => {
  throw new ExpressError(403, "Forbiden!");
});

app.use("/listings", listingRouter);

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
