import Shift from "../model/shift.js";

export const getAllShifts = async (req, res) => {
  const shifts = await Shift.find({});
  if (shifts.length === 0) {
    return res.status(404).json({ error: "No shifts found!" });
  }
  return res.status(200).json({ shifts: shifts });
};

export const getShiftByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;
  const shift = await Shift.findOne({ createdFor: employeeId });
  if (!shift) {
    return res
      .status(404)
      .json({ error: `No shift found for employeeId: ${employeeId}` });
  }
  return res.status(200).json({ shift: shift });
};

export const handleCreateShifts = async (req, res) => {
  const { type, endTime, startTime, weekOffs, userId } = req.body;
  const previous = await Shift.findOne({ createdFor: userId });
  if (previous) {
    return res
      .status(201)
      .send({ message: "already assigned a shift.", shift: previous });
  }
  const shift = new Shift({
    type,
    endTime,
    startTime,
    weekOffs,
    createdFor: userId,
  });
  await shift.save();
  return res.status(201).send({ message: "shift created.", shift: shift });
};
