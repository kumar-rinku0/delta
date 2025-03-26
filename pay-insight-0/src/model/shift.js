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
  weekOffs: {
    type: [String],
    default: ["sat", "sun"],
    required: true,
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
