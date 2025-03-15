// user is logged in or not check.
import { getUser } from "../util/jwt.js";

const isLoggedInCheck = (req, res, next) => {
  const cookie = req.cookies?.JWT_TOKEN;
  let user = getUser(cookie);
  req.user = user;
  return next();
};

const onlyLoggedInUser = (req, res, next) => {
  // req.session.originalUrl = req.originalUrl;
  let user = req.user;
  if (!user || user == null) {
    user = getUser(req.cookies?.JWT_TOKEN);
    req.user = user;
  }
  if (!user) {
    return res.status(400).send({ type: "error", msg: "login to access!" });
  }
  return next();
};

export { isLoggedInCheck, onlyLoggedInUser };
