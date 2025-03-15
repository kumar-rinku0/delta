import express from "express";
import { handleAddAttendance } from "../controller/attendance.js";

const router = express.Router();

router.post("/mark", handleAddAttendance);

export default router;
