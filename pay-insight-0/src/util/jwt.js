import jwt from "jsonwebtoken";

const KEY = process.env.SESSION_SECRET || "sdf548ijdsjf";
// KEY =

const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      givenName: user.givenName,
      email: user.email,
      roleInfo: user.roleInfo,
      company: user.company,
      status: user.status,
    },
    KEY,
    {
      expiresIn: "7d",
      algorithm: "HS512",
    }
  );
};

const getInfo = (token) => {
  return jwt.decode(token);
};

const getUser = (token, accessToken = KEY) => {
  if (!token) return null;
  try {
    return jwt.verify(token, accessToken);
  } catch (err) {
    return null;
  }
};

export { setUser, getUser, getInfo };
