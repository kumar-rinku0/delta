const { Router } = require("express");
const { randomUUID } = require("crypto");
const wrapAsync = require("../utils/wrap-async.js");
const ExpressError = require("../utils/express-error.js");
const User = require("../models/user.js");
const { setUser } = require("../utils/jwt.js");
const route = Router();

// sign in get requist
route.get("/signin", (req, res) => {
  return res
    .status(200)
    .render("signin.ejs", { title: "signin page!", user: null });
});

// sign up get requist
route.get("/signup", (req, res) => {
  return res
    .status(200)
    .render("signup.ejs", { title: "signup page!", user: null });
});

// sign out requist
route.get("/signout", (req, res) => {
  res.cookie("_session_token", null);
  req.session.regenerate((err) => {
    if (err) {
      throw new ExpressError(500, "session error!");
    }
  });
  return res.status(200).redirect("/");
});

// sign up middleware
route.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    const { username, email, password, actype } = req.body;
    console.log(actype);
    const user1 = new User({
      username,
      email,
      password,
      role: actype,
    });
    user1.status = "active";
    await user1.save();
    const token = setUser(user1);
    res.cookie("_session_token", token);
    console.log(req.user);
    req.flash("success", `hey!! ${username} welcome to luminous!`);
    const redirectUrl =
      req.session.originalUrl ||
      (actype === "admin" ? "/admin/users" : "/listings");
    return res.status(200).redirect(redirectUrl);
  })
);

// sign in middleware
route.post(
  "/signin",
  wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.isRightUser(username, password);
    if (user.message) {
      throw new ExpressError(401, user.message);
    }
    const token = setUser(user);
    res.cookie("_session_token", token);
    req.flash("success", `hey!! ${username} welcome to luminous!`);
    const redirectUrl =
      req.session.originalUrl ||
      (user.role === "admin" ? "/admin/users" : "/listings");
    res.status(200).redirect(redirectUrl);
  })
);

module.exports = route;
