const { Router } = require("express");
const { onlyLoggedInUser } = require("../middlewares/auth.js");
const wrapAsync = require("../utils/wrap-async.js");

const {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handleDeleteUser,
  handleUpdateUserUsername,
  handleChangeUserPassword,
} = require("../controllers/user.js");
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
  .get(onlyLoggedInUser, (req, res) => {
    const user = req.user;
    return res.render("account.ejs", { title: "account settings...", user });
  })
  .patch(onlyLoggedInUser, handleUpdateUserUsername)
  .put(onlyLoggedInUser, handleChangeUserPassword);

route.delete("/destroy", onlyLoggedInUser, handleDeleteUser);

module.exports = route;
