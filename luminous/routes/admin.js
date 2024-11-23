const { Router } = require("express");
const { randomUUID } = require("crypto");
const wrapAsync = require("../utils/wrap-async.js");
const ExpressError = require("../utils/express-error.js");
const User = require("../models/user.js");
const { setUser } = require("../utils/jwt.js");
const Admin = require("../models/admin.js");
const route = Router();

route.get("/users", async (req, res) => {
  let user = req.user;
  const allUsers = await User.find({});
  res.status(200).render("users.ejs", {
    user,
    allUsers,
    title: "users created yet!",
  });
});

route.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  user.status = user.status === "active" ? "inactive" : "active";
  await user.save();
  res.redirect("/admin/users");
});

module.exports = route;
