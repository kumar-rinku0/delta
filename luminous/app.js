require("dotenv").config();

const express = require("express");
const path = require("path");
const connection = require("./utils/init.js");
const Listing = require("./models/listing.js");
const listingRouter = require("./routes/listing.js");
const User = require("./models/user.js");
const { randomUUID } = require("crypto");
const sessions = require("./utils/sessions.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

connection();

app.get("/", (req, res) => {
  if (!sessions[req.headers?.cookie?.split("=")[1]]) {
    // res.status(401).send("session expired. login again!!");
    res.status(401).redirect("/user/signin");
  }
  console.log(sessions[req.headers?.cookie?.split("=")[1]]);
  res.status(200).redirect(`/listings`);
});

// sign up get requist
app.get("/user/signup", (req, res) => {
  res.status(200).render("signup.ejs", { title: "signup page!", user: null });
});

// sign up middleware
app.use("/user/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user1 = new User({
      username,
      email,
      password,
    });
    await user1.save();
    res.status(200).redirect("/user/signin");
  } catch (err) {
    next(err);
  }
});

// sign up get requist
app.get("/user/signin", (req, res) => {
  res.status(200).render("signin.ejs", { title: "signin page!", user: null });
});

// sign in middleware
app.use("/user/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.send("Username is Incorrect!!");
    }
    if (user.password != password) {
      res.send("Password is Incorrect!!");
    }
    const sessionId = randomUUID();
    sessions[sessionId] = { username };
    res.cookie("_session_uuid", sessionId, {
      secure: true,
      httpOnly: true,
    });
    res.status(200).redirect("/listings");
  } catch (err) {
    next(err);
  }
});

const isLogInUser = (req, res, next) => {
  if (!sessions[req.headers?.cookie?.split("=")[1]]) {
    res.status(401).send("session expired. login again!!");
    // res.status(401).redirect("/user/signin");
  }
  console.log(sessions[req.headers?.cookie?.split("=")[1]]);
  return next();
};

app.use("/listings", isLogInUser, listingRouter);

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
