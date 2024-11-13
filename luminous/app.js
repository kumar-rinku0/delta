require("dotenv").config();

const express = require("express");
const path = require("path");
const connection = require("./utils/init.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const sessions = require("./utils/sessions.js");
const ExpressError = require("./utils/express-error.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

connection();

// root route
app.get("/", (req, res) => {
  if (!sessions[req.headers?.cookie?.split("=")[1]]) {
    res.status(401).redirect("/user/signin");
  }
  console.log(sessions[req.headers?.cookie?.split("=")[1]]);
  res.status(200).redirect(`/listings`);
});

// user is logged in or not check.
const isLogInUser = (req, res, next) => {
  if (!sessions[req.headers?.cookie?.split("=")[1]]) {
    throw new ExpressError(401, "session expired. login again!!");
  }
  console.log(sessions[req.headers?.cookie?.split("=")[1]]);
  return next();
};

// route middleware
app.use("/user", userRouter);
app.use("/listings", isLogInUser, listingRouter);

// err middleware
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  const user = sessions[req.headers?.cookie?.split("=")[1]];
  if (!user) {
    res
      .status(status)
      .render("error.ejs", { message, title: "Error Page!!", user: null });
  }
  res
    .status(status)
    .render("error.ejs", { message, title: "Error Page!!", user });
});

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
