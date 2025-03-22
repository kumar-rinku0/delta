import { Schema, model } from "mongoose";
// branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

const punchInSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["On Time", "Half Day", "Late"],
      required: true,
    },
    punchInGeometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);
punchInSchema.index({ punchInGeometry: "2dsphere" });
const PunchIn = model("PunchIn", punchInSchema);

const punchOutSchema = new Schema(
  {
    status: {
      type: String,
      default: "Punch Out",
      enum: ["Punch Out"],
      required: true,
    },
    punchOutGeometry: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true }
);
punchOutSchema.index({ punchOutGeometry: "2dsphere" });
const PunchOut = model("PunchOut", punchOutSchema);

const attendanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  branchId: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  punchInInfo: {
    type: [Schema.Types.ObjectId],
    ref: "PunchIn",
  },
  punchOutInfo: {
    type: [Schema.Types.ObjectId],
    ref: "PunchOut",
  },
});

const Attendance = model("Attendance", attendanceSchema);

export { PunchIn, PunchOut, Attendance };
