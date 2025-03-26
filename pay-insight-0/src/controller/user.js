import Company from "../model/company.js";
import User from "../model/user.js";
import Shift from "../model/shift.js";
import { setUser } from "../util/jwt.js";
import bcrypt from "bcryptjs";
import { createMailSystem } from "../util/mail.js";
import { generateRandomString, isRightUser } from "../util/functions.js";

// login, logout & create user
const handleUserSignUp = async (req, res) => {
  const { givenName, familyName, email, password } = req.body;
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    return res
      .status(500)
      .send({ message: "user already exist.", user: userbyemail });
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
  const { familyName, givenName, email, role, companyId, branchId } = req.body;
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    const info = userbyemail.companyWithRole.filter((item) => {
      return item.company === companyId && item.branch === branchId;
    });
    if (!info[0]) {
      userbyemail.companyWithRole.push({
        role,
        company: companyId,
        branch: branchId,
      });
    } else {
      const obj = info[0];
      obj.role = role;
      userbyemail.companyWithRole.push(obj);
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
  user.companyWithRole.push({ role, company: companyId, branch: branchId });
  await user.save();
  await createMailSystem({
    address: user.email,
    type: "password",
    _id: password,
  });
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).json({ message: "ok", user: user });
};

const handleUserSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await isRightUser(email, password);
  if (user?.message) {
    return res.status(401).json({ message: user.message, status: user.status });
  }
  // if (user.companyWithRole.length === 0) {
  //   return res
  //     .status(200)
  //     .json({ message: "user not assigned to any company.", user: user });
  // }
  if (user.companyWithRole.length !== 0) {
    const company = await Company.findById(user.companyWithRole[0].company);
    if (!company) {
      return res
        .status(400)
        .json({ message: "company not found.", user: user });
    }
    user.company = company;
    user.roleInfo = user.companyWithRole[0];
  }
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: "/",
  });
  return res.status(200).json({
    user: user,
    company: user.company,
    roleInfo: user.roleInfo,
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
  return res.status(400).json({ message: "Invalid token.", status: 400 });
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
    return res.status(400).json({ message: "user not found." });
  }
  await createMailSystem({ address: email, type: "reset", _id: user._id });
  return res.status(200).json({ message: "reset email sent." });
};

const handleUserResetPassword = async (req, res) => {
  const { TOKEN } = req.query;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: TOKEN });
  if (!user) {
    return res.status(400).json({ message: "Invalid token." });
  }
  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ message: "Token expired." });
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
  const user = await User.findById(userId).populate("companyWithRole.company");
  if (!user) {
    return res.status(400).json({ message: "invailid user id." });
  }
  return res.status(200).json({ user: user, message: "ok!" });
};

const handleGetUserByCompanyId = async (req, res) => {
  const { companyId } = req.params;
  const users = await User.find({
    companyWithRole: {
      $elemMatch: {
        company: companyId,
        role: { $in: ["employee", "manager"] },
      },
    },
  });
  if (users.length > 0) {
    return res.status(200).send({ message: "done!", users: users });
  }
  return res.status(400).send({ message: "invalid company id!" });
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

// const isRightUser = async function (email, password) {
//   const user = await User.findOne({ email }).populate(
//     "companyWithRole.company"
//   );
//   if (!user) {
//     return { message: "wrong email." };
//   }
//   const isOk = await bcrypt.compare(password.trim(), user.password);
//   if (!isOk) {
//     return { message: "wrong password." };
//   }
//   return user;
// };
