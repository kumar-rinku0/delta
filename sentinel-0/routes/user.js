const { Router } = require("express");
const crypto = require("crypto");
const { onlyLoggedInUser } = require("../middlewares/auth.js");
const wrapAsync = require("../utils/wrap-async.js");
const { setUser } = require("../utils/jwt.js");
const { authorizeUrl, getToken } = require("../utils/auth.js");

const {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handleDeleteUser,
  handleUpdateUserUsername,
  handleChangeUserPassword,
  handleGoogleCallback,
} = require("../controllers/user.js");
const User = require("../models/user.js");
const route = Router();

// sign in get requist
route
  .route("/signin")
  .get((req, res) => {
    return res
      .status(200)
      .render("signin.ejs", { title: "signin page!", user: null });
  })
  .post(wrapAsync(handleSignIn));

// sign up get requist
route
  .route("/signup")
  .get((req, res) => {
    return res
      .status(200)
      .render("signup.ejs", { title: "signup page!", user: null });
  })
  .post(wrapAsync(handleSignUp));

// sign out requist
route.get("/signout", handleSignOut);

route
  .route("/account")
  .patch(onlyLoggedInUser, handleUpdateUserUsername)
  .put(onlyLoggedInUser, handleChangeUserPassword);

route.delete("/destroy", onlyLoggedInUser, handleDeleteUser);

route.get("/auth/google", (req, res) => {
  if (authorizeUrl === null || authorizeUrl === false) {
    return res.status(500).json({ message: "Google Auth is not available" });
  }
  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;
  return res.status(200).redirect(authorizeUrl);
});

route.post("/auth/google/callback", wrapAsync(handleGoogleCallback));

module.exports = route;
