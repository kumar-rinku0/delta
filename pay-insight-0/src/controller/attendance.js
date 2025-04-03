import { PunchIn, PunchOut, Attendance } from "../model/attendance.js";
import { formatDateForComparison } from "../util/functions.js";
import { reverseGeocode } from "../util/functions.js";

const handlemarkPunchIn = async (req, res) => {
  const { userId, companyId, branchId, punchInGeometry } = req.body;
  const date = formatDateForComparison(new Date());
  const month = new Date().toLocaleString("en-IN", {
    month: "long",
  });
  const punchInAddress = await reverseGeocode(
    punchInGeometry.coordinates[1],
    punchInGeometry.coordinates[0]
  );
  const punchIn = new PunchIn({
    punchInGeometry,
    punchInAddress,
  });
  await punchIn.save();
  const prevAttendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  if (prevAttendance) {
    prevAttendance.punchingInfo.push({ punchInInfo: punchIn });
    await prevAttendance.save();

    return res.status(201).json({ message: "punched in!", punchIn: punchIn });
  }
  const attendance = new Attendance({
    userId,
    companyId,
    branchId,
    date,
    month,
  });
  attendance.punchingInfo.push({ punchInInfo: punchIn });
  await attendance.save();

  return res.status(201).json({ message: "punched in!", punchIn: punchIn });
};

const handlemarkPunchOut = async (req, res) => {
  const { userId, companyId, branchId, punchOutGeometry } = req.body;
  const punchOutAddress = await reverseGeocode(
    punchOutGeometry.coordinates[1],
    punchOutGeometry.coordinates[0]
  );
  const punchOut = new PunchOut({
    punchOutGeometry,
    punchOutAddress,
  });
  await punchOut.save();
  const date = formatDateForComparison(new Date());

  const attendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  const lastPunchInInfo = attendance.punchingInfo.pop();
  lastPunchInInfo.punchOutInfo = punchOut;
  attendance.punchingInfo.push(lastPunchInInfo);
  await attendance.save();

  res.status(201).json({ message: "punched out!", attendance: attendance });
};

// Get All Attendance Records
const handleGetOneSpecificUserAttendance = async (req, res) => {
  const { userId, companyId, branchId } = req.body;
  const date = formatDateForComparison(new Date());

  const attendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  if (!attendance) {
    return res.status(200).json({
      message: "user isn't punched in yet!",
      lastPuchedOut: true,
    });
  }
  if (attendance && attendance.punchingInfo.length === 0) {
    return res.status(200).json({
      message: "info doesnt exist!",
      lastPuchedOut: true,
    });
  }
  const lastPunchingInfo = attendance.punchingInfo.pop();
  let lastPuchedOut = false;
  if (lastPunchingInfo.punchOutInfo) {
    lastPuchedOut = true;
  }
  return res.status(200).json({
    message: "user already punched in!",
    lastPunchingInfo: lastPunchingInfo,
    lastPuchedOut: lastPuchedOut,
    attendance: attendance,
  });
};

const handleGetOneSpecificMonthAttendance = async (req, res) => {
  const { userId, companyId, branchId } = req.body;
  const currentMonth = new Date().toLocaleString("en-IN", {
    month: "long",
  });
  const attendance = await Attendance.find({
    $and: [
      {
        month: currentMonth,
        companyId: companyId,
        userId: userId,
        branchId: branchId,
      },
    ],
  }).populate("punchingInfo.punchInInfo");
  return res.status(200).json({
    message: "ok",
    attendance: attendance,
  });
};

const handleGetOneSpecificDateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const attendance = await Attendance.findById(attendanceId)
    .populate("punchingInfo.punchInInfo")
    .populate("punchingInfo.punchOutInfo");
  if (!attendance) {
    return res.status(404).json({
      message: "Attendance not found!",
    });
  }
  return res.status(200).json({
    message: "ok",
    attendance: attendance,
  });
};

// Fetch attendance statistics for the dashboard
const handleGetAttendanceCount = async (req, res) => {
  // const { companyId } = req.params;
  const user = req.user;
  const attendance = await Attendance.find({
    $and: [
      {
        date: formatDateForComparison(new Date()),
        companyId: user.roleInfo.company,
      },
    ],
    // branchId: user.roleInfo.branch,
  })
    .populate("punchingInfo.punchInInfo")
    .populate("punchingInfo.punchOutInfo");

  return res.status(200).json({
    message: "ok",
    attendance: attendance,
    puchInCount: attendance.length,
  });
};

export {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendance,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetAttendanceCount,
};
