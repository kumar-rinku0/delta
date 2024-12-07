const { Router } = require("express");
const { randomUUID } = require("crypto");
const wrapAsync = require("../utils/wrap-async.js");
const ExpressError = require("../utils/express-error.js");
const User = require("../models/user.js");
const { setUser } = require("../utils/jwt.js");
const route = Router();

// sign in get requist
route.get("/signin", (req, res) => {
  return res.status(200).send({ data: "success!" });
});

// sign up get requist
route.get("/signup", (req, res) => {
  return res.status(200).redirect("/");
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
    console.log(req.body);
    let { username, email, password, actype } = req.body;
    if (!actype) {
      actype = "local";
    }
    const user1 = new User({
      username,
      email,
      password,
      role: actype,
    });
    user1.status = "active";
    const userCheck = await User.findOne({ username }).exec();
    if (userCheck) {
      return res
        .status(200)
        .send({ res: "failed", msg: "username aleady exist!" });
    }
    const userCheck2 = await User.findOne({ email }).exec();
    if (userCheck2) {
      return res
        .status(200)
        .send({ res: "failed", msg: "email aleady exist!" });
    }
    await user1.save();
    const token = setUser(user1);
    res.cookie("_session_token", token);
    console.log(req.user);
    req.flash("success", `hey!! ${username} welcome to luminous!`);
    const redirectUrl =
      req.session.originalUrl ||
      (actype === "admin" ? "/admin/users" : "/listings");
    return res.status(200).send({ user: user1, msg: "success" });
  })
);

// sign in middleware
route.post(
  "/signin",
  wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.isRightUser(username, password);
    if (user.message) {
      return res.status(200).send({ res: "failed", msg: user.message });
    }
    const token = setUser(user);
    res.cookie("_session_token", token);
    req.flash("success", `hey!! ${username} welcome to luminous!`);
    const redirectUrl =
      req.session.originalUrl ||
      (user.role === "admin" ? "/admin/users" : "/listings");
    return res.status(200).send({ user: user, res: "success" });
  })
);

module.exports = route;
