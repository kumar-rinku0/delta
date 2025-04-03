import { Schema, model } from "mongoose";
import Shift from "../model/shift.js";
import { currntTimeInFixedFomat } from "../util/functions.js";

// branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

const punchInSchema = new Schema(
  {
    status: {
      type: String,
      default: "punch in",
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
    punchInAddress: String,
  },
  { timestamps: true }
);
punchInSchema.index({ punchInGeometry: "2dsphere" });
const PunchIn = model("PunchIn", punchInSchema);

const punchOutSchema = new Schema(
  {
    status: {
      type: String,
      default: "punch out",
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
    punchOutAddress: String,
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
  month: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["on time", "late", "half day"],
      message: "invailid status!",
    },
  },
  punchingInfo: {
    type: [
      {
        punchInInfo: {
          type: Schema.Types.ObjectId,
          ref: "PunchIn",
        },
        punchOutInfo: {
          type: Schema.Types.ObjectId,
          ref: "PunchOut",
        },
      },
    ],
    required: true,
  },
});

attendanceSchema.pre("save", async function (next) {
  if (this.punchingInfo) {
    const lastObj = this.punchingInfo.pop();
    const currDate = lastObj.punchInInfo.getTimestamp;
    const currTime = currntTimeInFixedFomat(currDate);
    const shift = await Shift.findOne({ employeeId: this.userId });
    const delay = currntTimeInFixedFomat(currDate, shift.halfDayLateBy);
    if (shift.shiftStartTime >= currTime) {
      this.status = "on time";
    } else if (
      shift.shiftStartTime < currTime &&
      shift.shiftStartTime >= delay
    ) {
      this.status = "late";
    } else if (shift.shiftStartTime < delay) {
      this.status = "half day";
    }
    this.punchingInfo.push(lastObj);
  }
  return next();
});

const Attendance = model("Attendance", attendanceSchema);

export { PunchIn, PunchOut, Attendance };
