// user is logged in or not check.
const ExpressError = require("../utils/express-error.js");
const { getUser } = require("../utils/jwt.js");

const isLoggedInCheck = (req, res, next) => {
  const cookie = req.cookies?._session_token;
  let user = getUser(cookie);
  req.user = user;
  return next();
};

const onlyLoggedInUser = (req, res, next) => {
  req.session.originalUrl = req.originalUrl;
  let user = req.user;
  if (!user || user == null) {
    user = getUser(req.cookies?._session_token);
    req.user = user;
  }
  // if (!user && !req?.baseUrl) {
  //   return res.send("/login");
  // }
  if (!user) {
    // throw new ExpressError(401, "session expired. login again!!");
    return res.status(400).send({ type: "error", msg: "login to access!" });
  }
  if (user.status !== "active") {
    throw new ExpressError(401, "unauthorized req. or blocked by admin!!");
  }
  return next();
};

const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    throw new ExpressError(403, "forbiden page!!");
  }
  return next();
};

// flash middleware
const setFlash = (req, res, next) => {
  res.locals.flash_success = req.flash("success");
  res.locals.flash_error = req.flash("error");
  return next();
};

module.exports = {
  isLoggedInCheck,
  onlyLoggedInUser,
  isAdmin,
  setFlash,
};
