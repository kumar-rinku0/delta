import Company from "../model/company.js";
import User from "../model/user.js";
import Shift from "../model/shift.js";
import { setUser } from "../util/jwt.js";
import bcrypt from "bcryptjs";
import { createMailSystem, createMailSystemForEmployee } from "../util/mail.js";
import { generateRandomString, isRightUser } from "../util/functions.js";

// login, logout & create user
const handleUserSignUp = async (req, res) => {
  const { givenName, familyName, email, password } = req.body;
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    return res
      .status(400)
      .send({ error: "user already exist.", user: userbyemail });
  }
  const user = new User({
    givenName,
    familyName,
    email,
    password,
  });
  await user.save();
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).send({ message: "user created.", user: user });
};

const handleUserSignUpWithRoles = async (req, res) => {
  const { familyName, givenName, email, role } = req.body;
  const { _id, branch, role: companyRole } = req.user.company;
  if (companyRole === "manager" && role === "admin") {
    return res
      .status(401)
      .send({ error: "you are not allowed to create admin!" });
  }
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    const info = userbyemail.roleInfo.filter((item) => {
      return item.company === _id && item.branch === branch;
    });
    if (!info[0]) {
      userbyemail.roleInfo.push({
        role,
        company: _id,
        branch,
      });
    } else {
      const obj = info[0];
      obj.role = role;
      userbyemail.roleInfo.push(obj);
    }
    await userbyemail.save();
    return res
      .status(200)
      .send({ message: "user role updated!", user: userbyemail });
  }
  const password = generateRandomString(8, true);
  const user = new User({
    givenName,
    familyName,
    email,
    password,
  });
  console.log(password);
  user.roleInfo.push({ role, company: _id, branch });
  await user.save();
  await createMailSystemForEmployee({
    address: user.email,
    _id: user._id,
    password,
  });
  return res.status(200).json({ message: "ok", user: user });
};

const handleUserSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await isRightUser(email, password);
  if (user?.message) {
    return res.status(401).json({ error: user.message, status: user.status });
  }

  if (user.roleInfo.length !== 0) {
    const company = await Company.findById(user.roleInfo[0].company);
    if (company) {
      const roleInfo = user.roleInfo[0];
      user.company = {
        _id: company._id,
        name: company.name,
        role: roleInfo.role,
        branch: roleInfo.branch,
      };
    }
  }
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // Prevent CSRF
  });

  return res.status(200).json({
    user: user,
    company: user.company,
    message: "login successful. if user have company it will be in user!",
  });
};

const handleUserLogout = async (req, res) => {
  res.cookie("JWT_TOKEN", "");
  return res.status(200).json({ message: "logout successful" });
};

// verify user
const handleUserVerify = async (req, res) => {
  const { TOKEN } = req.query;
  console.log(TOKEN);
  const user = await User.findOne({ verifyToken: TOKEN });
  if (user && user.verifyTokenExpire > Date.now()) {
    const info = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        verifyToken: null,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "User verified.", user: info, status: 200 });
  }
  return res.status(400).json({ error: "Invalid token.", status: 400 });
};

const handleUserSendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found." });
  }
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).json({ message: "verify email sent." });
};

// reset password
const handleUserSendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "user not found." });
  }
  await createMailSystem({ address: email, type: "reset", _id: user._id });
  return res.status(200).json({ message: "reset email sent." });
};

const handleUserResetPassword = async (req, res) => {
  const { TOKEN } = req.query;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: TOKEN });
  if (!user) {
    return res.status(400).json({ error: "Invalid token." });
  }
  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ error: "Token expired." });
  }
  const salt = await bcrypt.genSalt(10);
  const hexcode = await bcrypt.hash(password.trim(), salt);
  const info = await User.findByIdAndUpdate(
    user._id,
    {
      password: hexcode,
      resetToken: null,
    },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Password reset successful.", user: info });
};

const handleGetOneUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("roleInfo.company");
  if (!user) {
    return res.status(400).json({ error: "invailid user id." });
  }
  return res.status(200).json({ user: user, message: "user populated!" });
};

const handleGetUserByCompanyId = async (req, res) => {
  const { companyId } = req.params;
  const users = await User.find({
    roleInfo: {
      $elemMatch: {
        company: companyId,
        role: { $in: ["employee", "manager"] },
      },
    },
  });
  if (users.length > 0) {
    return res
      .status(200)
      .send({ message: "employee & manager in company!", users: users });
  }
  return res.status(400).send({ error: "invalid company id!" });
};

export {
  handleUserSignUp,
  handleUserSignIn,
  handleUserLogout,
  handleUserVerify,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
  handleGetOneUser,
  handleGetUserByCompanyId,
  handleUserSignUpWithRoles,
};
