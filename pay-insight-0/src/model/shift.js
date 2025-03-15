import { Schema, model } from "mongoose";

const shiftShema = new Schema({
  shiftType: {
    type: String,
    enum: {
      values: ["morning", "evening", "night"],
      message: "invailid shift!",
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
