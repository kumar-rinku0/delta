require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connection = require("./utils/init.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const ExpressError = require("./utils/express-error.js");
const { getUser } = require("./utils/jwt.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connection();

// user is logged in or not check.
const isLogInUser = (req, res, next) => {
  let user = getUser(req.cookies?._session_token);
  req.user = user;
  if (!user && !req?.baseUrl) {
    res.redirect("/user/signin");
  }
  if (!user) {
    throw new ExpressError(401, "session expired. login again!!");
  }
  return next();
};

// root route
app.get("/", isLogInUser, (req, res) => {
  res.status(200).redirect(`/listings`);
});

// route middleware
app.use("/user", userRouter);
app.use("/listings", isLogInUser, listingRouter);

// err middleware
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  let user = req.user;
  if (!user) {
    res
      .status(status)
      .render("error.ejs", { message, title: `${status} !!`, user: null });
  }
  res
    .status(status)
    .render("error.ejs", { message, title: `${status} !!`, user });
});

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
