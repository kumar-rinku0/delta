if (process.env.NODE_ENV != "development") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const connection = require("./utils/init.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");
const { randomUUID } = require("crypto");
const {
  onlyLoggedInUser,
  isAdmin,
  isLoggedInCheck,
} = require("./middlewares/auth.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// session
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "KEYBOARD & mE!",
  genid: (req) => {
    return randomUUID();
  },
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("trust proxy", 1);
app.use(session(sessionOptions));
app.use(flash());
// database connection.
connection();

// root route
app.get("/", (req, res) => {
  res.status(200).redirect("listings");
});

// flash middleware
app.use((req, res, next) => {
  res.locals.flash_success = req.flash("success");
  return next();
});

// route middleware
app.use("/user", userRouter);
app.use("/listings", isLoggedInCheck, listingRouter);
app.use("/admin", onlyLoggedInUser, isAdmin, adminRouter);

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
