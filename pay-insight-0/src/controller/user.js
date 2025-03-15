import Company from "../model/company.js";
import User from "../model/user.js";
import Shift from "../model/shift.js";
import { setUser } from "../util/jwt.js";
import bcrypt from "bcryptjs";

const handleUserSignUp = async (req, res) => {
  const obj = req.body;
  console.log(obj);
  const userbyemail = await User.findOne({ email: obj.email });
  if (userbyemail) {
    return res
      .status(500)
      .send({ message: "user already exist.", user: userbyemail });
  }
  const user = new User(obj);
  try {
    await user.save();
    // if (obj?.role !== "admin") {
    //   const shift = new Shift({
    //     shiftType: obj.shiftType,
    //     shiftStartTime: obj.shiftStartTime,
    //     shiftEndTime: obj.shiftEndTime,
    //     employeeId: user,
    //   });
    //   await shift.save();
    // }
  } catch (error) {
    return res.status(500).send({ message: "server error.", user: user });
  }
  // createMailSystem({ address: user.email, type: "verify", _id: user._id });
  return res.status(200).send({ message: "user created.", user: user });
};

const handleUserSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await isRightUser(email, password);
  if (user?.message) {
    return res.status(401).json({ message: user.message, status: 401 });
  }
  const token = setUser(user);
  res.cookie("_session_token", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res.status(200).json({ user: user, message: "login successful" });
};

const handleUserLogout = async (req, res) => {
  res.cookie("_session_token", "");
  return res.status(200).json({ message: "logout successful" });
};

const handleUserVerify = async (req, res) => {
  const { TOKEN } = req.query;
  console.log(TOKEN);
  return res.json({ message: "user verified!" });
};

const isRightUser = async function (email, password) {
  const user = await User.findOne({ email }).populate(
    "companyWithRole.company"
  );
  if (!user) {
    return { message: "wrong email." };
  }
  const isOk = await bcrypt.compare(password.trim(), user.password);
  if (!isOk) {
    return { message: "wrong password." };
  }
  return user;
};

export {
  handleUserSignUp,
  handleUserSignIn,
  handleUserVerify,
  handleUserLogout,
};
