import { PunchIn, PunchOut, Attendance } from "../model/attendance.js";

const handlemarkPunchIn = async (req, res) => {
  const { userId, companyId, branchId, date, status, punchInGeometry } =
    req.body;

  const punchIn = new PunchIn({
    status,
    punchInGeometry,
  });
  await punchIn.save();
  const prevAttendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  if (prevAttendance) {
    prevAttendance.punchInInfo.push(punchIn);
    await prevAttendance.save();

    return res.status(201).json({ message: "punched in!", punchIn: punchIn });
  }
  const attendance = new Attendance({
    userId,
    companyId,
    branchId,
    date,
  });
  attendance.punchInInfo.push(punchIn);
  await attendance.save();

  return res.status(201).json({ message: "punched in!", punchIn: punchIn });
};

const handlemarkPunchOut = async (req, res) => {
  const { userId, companyId, branchId, date, status, punchOutGeometry } =
    req.body;

  const punchOut = new PunchOut({
    status,
    punchOutGeometry,
  });
  await punchOut.save();

  const attendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  attendance.punchOutInfo.push(punchOut);
  await attendance.save();

  res.status(201).json({ message: "punched out!", attendance: attendance });
};

// Get All Attendance Records
const handlegetAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Error fetching records", logs: error });
  }
};

export { handlemarkPunchIn, handlemarkPunchOut, handlegetAllAttendance };
