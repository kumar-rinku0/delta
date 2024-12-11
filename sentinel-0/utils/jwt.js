const jwt = require("jsonwebtoken");

const key = process.env.KEY || "this&is*key!";
// KEY =

const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    key,
    {
      expiresIn: "1h",
    }
  );
};

const getUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, key);
  } catch (err) {
    return null;
  }
};

module.exports = {
  setUser,
  getUser,
};
