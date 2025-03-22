import express from "express";
import wrapAsync from "../util/wrap-async.js";
import { getAllShifts, getShiftByEmployeeId } from "../controller/shift.js";

const router = express.Router();

router.get("/all", wrapAsync(getAllShifts));
router.get("/:employeeId", wrapAsync(getShiftByEmployeeId));

export default router;
