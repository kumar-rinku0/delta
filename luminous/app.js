require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
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
const sess = {
  secret: process.env.SESSION_SECRET || "KEYBOARD & mE!",
  genid: (req) => {
    return randomUUID();
  },
  resave: false,
  saveUninitialized: true,
  cookie: {},
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
// database connection.
connection();

// root route
app.get("/", (req, res) => {
  res.status(200).redirect("listings");
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
