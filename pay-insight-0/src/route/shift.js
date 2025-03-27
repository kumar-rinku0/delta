import express from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  getAllShifts,
  getShiftByEmployeeId,
  handleCreateShifts,
} from "../controller/shift.js";
import { onlyAdminOrManagerUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/all", wrapAsync(getAllShifts));
router.get("/:employeeId", wrapAsync(getShiftByEmployeeId));
router
  .route("/create")
  .post(onlyAdminOrManagerUser, wrapAsync(handleCreateShifts));

export default router;
