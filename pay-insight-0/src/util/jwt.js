import jwt from "jsonwebtoken";

const KEY = process.env.SESSION_SECRET || "sdf548ijdsjf";
// KEY =

const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      name: `${user.givenName} ${user.familyName}`,
      picture: user.picture,
      email: user.email,
      role: user.role,
      company: {
        _id: user.company?._id,
        name: user.company?.name,
        role: user.company?.role,
        branch: user.company?.branch,
        code: user.company?.code,
      },
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
