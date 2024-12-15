const jwt = require("jsonwebtoken");

const KEY = process.env.SESSION_SECRET;
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
    KEY,
    {
      expiresIn: "7d",
      algorithm: "HS512",
    }
  );
};

const getUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, KEY);
  } catch (err) {
    return null;
  }
};

module.exports = {
  setUser,
  getUser,
};
