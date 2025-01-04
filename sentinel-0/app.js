if (process.env.NODE_ENV != "development") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// database connection
const connection = require("./utils/init.js");

// routers
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");

// middlewares
const adminRouter = require("./routes/admin.js");
const {
  onlyLoggedInUser,
  isAdmin,
  isLoggedInCheck,
} = require("./middlewares/auth.js");

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET = process.env.SESSION_SECRET || "KEYBOARD & mE!";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// session
const MONGO_URI = process.env.MONGO_URI;
const store = MongoStore.create({
  mongoUrl: MONGO_URI,
  touchAfter: 24 * 3600,
  crypto: {
    secret: SECRET,
  },
  ttl: 7 * 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("ERROR WHILE STORING SESSIONS!", err);
});

const sessionOptions = {
  store,
  secret: SECRET,
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

// database connection.
connection();

app.use(isLoggedInCheck);
// root route
app.get("/", (req, res) => {
  return res.status(200).send({ req: "OK!" });
});

app.get("/api", (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(200).send({ user: null });
  }
  return res.status(200).send({ user: user });
});

// route middleware
app.use("/api/user", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/review", onlyLoggedInUser, reviewRouter);
app.use("/api/admin", onlyLoggedInUser, isAdmin, adminRouter);

// err middleware
app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message } = err;
  let user = req.user;
  if (!user) {
    res.status(status).send({ message, status: status, user: null });
  }
  res.status(status).send({ message, status: status, user });
});

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
