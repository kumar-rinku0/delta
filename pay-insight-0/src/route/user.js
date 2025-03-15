import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleUserSignUp,
  handleUserSignIn,
  handleUserVerify,
  handleUserLogout,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
} from "../controller/user.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/verify").get(wrapAsync(handleUserVerify));
route.route("/verify").post(wrapAsync(handleUserSendVerifyEmail));

route.route("/reset").post(wrapAsync(handleUserSendResetEmail));
route.route("/reset").put(wrapAsync(handleUserResetPassword));

route.route("/login").post(wrapAsync(handleUserSignIn));
route.route("/register").post(wrapAsync(handleUserSignUp));
route.route("/logout").get(wrapAsync(handleUserLogout));

export default route;
