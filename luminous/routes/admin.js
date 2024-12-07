const { Router } = require("express");
const { randomUUID } = require("crypto");
const wrapAsync = require("../utils/wrap-async.js");
const ExpressError = require("../utils/express-error.js");
const User = require("../models/user.js");
const { setUser } = require("../utils/jwt.js");
const route = Router();

route.get("/users", async (req, res) => {
  let user = req.user;
  const allUsers = await User.find({ role: "local" });
  res.status(200).send({
    user,
    allUsers,
    title: "users created yet!",
  });
});

route.post(
  "/:userId",
  wrapAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();
    res.redirect("/admin/users");
  })
);

module.exports = route;
