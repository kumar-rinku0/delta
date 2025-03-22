import { Schema, model } from "mongoose";

const shiftShema = new Schema({
  type: {
    type: String,
    default: "morning",
    enum: {
      values: ["morning", "evening", "night"],
      message: "invailid shift!",
    },
  },
  workDays: {
    type: Number,
    default: 5,
    enum: {
      values: [4, 5, 6, 7],
      message: "invalid work days input!",
    },
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  createdFor: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const Shift = model("Shift", shiftShema);

export default Shift;
