const { Router } = require("express");
const { randomUUID } = require("crypto");
const wrapAsync = require("../utils/wrap-async.js");
const ExpressError = require("../utils/express-error.js");
const User = require("../models/user.js");
const { setUser } = require("../utils/jwt.js");
const Admin = require("../models/admin.js");
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
  res.cookie("_session_token", null);
  res.status(200).redirect("/user/signin");
});

// sign up middleware
route.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    const { username, email, password, actype } = req.body;
    console.log(actype);
    if (actype === "admin") {
      const admin1 = new Admin({
        username,
        email,
        password,
      });
      admin1.save();
      const token = setUser(admin1);
      res.cookie("_session_token", token);
      res.redirect("/admin/users");
    }
    const user1 = new User({
      username,
      email,
      password,
    });
    user1.status = "active";
    await user1.save();
    const token = setUser(user1);
    res.cookie("_session_token", token);

    res.status(200).redirect("/listings");
  })
);

// sign in middleware
route.post(
  "/signin",
  wrapAsync(async (req, res) => {
    const { username, password, actype } = req.body;
    console.log(actype);
    if (actype === "admin") {
      const admin = await Admin.isRightUser(username, password);
      if (admin.message) {
        throw new ExpressError(401, admin.message);
      }
      const token = setUser(admin);
      res.cookie("_session_token", token);
      res.status(200).redirect("/admin/users");
    }
    const user = await User.isRightUser(username, password);
    if (user.message) {
      throw new ExpressError(401, user.message);
    }

    const token = setUser(user);
    res.cookie("_session_token", token);
    res.status(200).redirect("/listings");
  })
);

module.exports = route;
