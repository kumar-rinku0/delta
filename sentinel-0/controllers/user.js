const User = require("../models/user.js");
const ExpressError = require("../utils/express-error.js");
const { setUser } = require("../utils/jwt.js");

const handleSignIn = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.isRightUser(username, password);
  if (user.message) {
    return res
      .status(401)
      .send({ type: "error", msg: user.message, auth: "failed" });
  }
  const token = setUser(user);
  res.cookie("_session_token", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  const redirectUrl =
    req.session.originalUrl || (user.role === "admin" ? "/admin/users" : "/");
  return res.status(200).send({ user: user });
};

const handleSignUp = async (req, res) => {
  const { username, email, password } = req.body;
  let { actype } = req.body;
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
  const user2 = await User.findOne({ username }).exec();
  if (user2) {
    return res
      .status(400)
      .send({ type: "error", msg: "Username already exist!", auth: "failed" });
  }
  const user3 = await User.findOne({ email }).exec();
  if (user3) {
    return res
      .status(400)
      .send({ type: "error", msg: "E-mail already exist!", auth: "failed" });
  }
  await user1.save();
  const token = setUser(user1);
  res.cookie("_session_token", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  const redirectUrl =
    req.session.originalUrl || (actype === "admin" ? "/admin/users" : "/");
  return res.status(200).send({ user: user1 });
};

const handleSignOut = (req, res) => {
  res.cookie("_session_token", null);
  req.session.destroy((err) => {
    if (err) {
      throw new ExpressError(500, "session error!");
    }
  });
  return res.status(200).redirect("/");
};

const handleDeleteUser = async (req, res) => {
  const user = req.user;
  const id = user._id;
  const deletedUser = await User.deleteUser(id);
  res.cookie("_session_token", null);
  req.session.destroy((err) => {
    if (err) {
      throw new ExpressError(500, "session error!");
    }
  });
  console.log(deletedUser);
  return res
    .status(200)
    .send({ type: "success", msg: "user pruned!", deletedUser: deletedUser });
};

const handleUpdateUserUsername = async (req, res) => {
  const user = req.user;
  const { username } = req.body;
  if (username === user.username) {
    return res
      .status(400)
      .send({ type: "error", msg: "it's current username!" });
  }
  const userCheck = await User.findOne({ username });
  if (userCheck) {
    return res.status(400).send({ type: "error", msg: "invalid username!" });
  }
  const updatedUser = await User.findOneAndUpdate(
    { username: user.username },
    { username },
    { new: true }
  );
  req.user = updatedUser;
  const token = setUser(updatedUser);
  res.cookie("_session_token", token);
  return res.status(200).send({
    type: "success",
    msg: "username updated!",
    updatedUser: updatedUser,
  });
};

const handleChangeUserPassword = async (req, res) => {
  const user = req.user;
  const { oldpassword, newpassword } = req.body;
  if (oldpassword === newpassword) {
    return res.status(400).send({ type: "error", msg: "same password!" });
  }
  const userCheck = await User.isRightUser(user.username, oldpassword);
  if (userCheck.message) {
    return res.status(400).send({ type: "error", msg: userCheck.message });
  }
  userCheck.password = newpassword;
  await userCheck.save();
  return res.status(200).send({ type: "success", msg: "password updated!" });
};

module.exports = {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleDeleteUser,
  handleUpdateUserUsername,
  handleChangeUserPassword,
};
