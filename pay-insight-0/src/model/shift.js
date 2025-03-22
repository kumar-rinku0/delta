import { Schema, model } from "mongoose";

const shiftShema = new Schema({
  shiftType: {
    type: String,
    enum: {
      values: ["morning", "evening", "night"],
      message: "invailid shift!",
    },
  },
  workDays: {
    type: String,
    default: "Mon-Sat",
    enum: {
      values: ["Mon-Fri", "Mon-Sat"],
      message: "invalid work days input!",
    },
  },
  shiftStartTime: {
    type: String,
    required: true,
  },
  shiftEndTime: {
    type: String,
    required: true,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const Shift = model("Shift", shiftShema);

export default Shift;
