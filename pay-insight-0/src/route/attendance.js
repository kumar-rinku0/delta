import express from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handlemarkPunchIn,
  handlemarkPunchOut,
} from "../controller/attendance.js";

const router = express.Router();

router.route("/mark").post(wrapAsync(handlemarkPunchIn));
router.route("/mark").put(wrapAsync(handlemarkPunchOut));

export default router;
