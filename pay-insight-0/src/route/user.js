import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleUserSignUp,
  handleUserSignIn,
  handleUserVerify,
  handleUserLogout,
} from "../controller/user.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/verify").get(handleUserVerify);

route.route("/signin").post(wrapAsync(handleUserSignIn));
route.route("/signup").post(wrapAsync(handleUserSignUp));
route.route("/logout").get(wrapAsync(handleUserLogout));

export default route;
