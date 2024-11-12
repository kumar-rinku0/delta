const { Router } = require("express");
const { randomUUID } = require("crypto");
const sessions = require("../utils/sessions.js");
const User = require("../models/user.js");
const route = Router();

// sign in get requist
route.get("/signin", (req, res) => {
  res.status(200).render("signin.ejs", { title: "signin page!", user: null });
});

// sign up get requist
route.get("/signup", (req, res) => {
  res.status(200).render("signup.ejs", { title: "signup page!", user: null });
});

// sign out requist
route.get("/signout", (req, res) => {
  res.cookie("_session_uuid", null, {
    secure: true,
    httpOnly: true,
  });
  res.status(200).redirect("/user/signin");
});

// sign up middleware
route.post("/signup", async (req, res, next) => {
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

// sign in middleware
route.post("/signin", async (req, res, next) => {
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
    sessions[sessionId] = { username, id: user._id };
    res.cookie("_session_uuid", sessionId, {
      secure: true,
      httpOnly: true,
    });
    res.status(200).redirect("/listings");
  } catch (err) {
    next(err);
  }
});

module.exports = route;