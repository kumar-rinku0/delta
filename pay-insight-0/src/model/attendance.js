import { Schema, model } from "mongoose";

const attendanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "On Time", "Late", "Half Day", "Punched Out"],
      default: "Absent",
    },
    checkInGeometry: {
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
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutGeometry: {
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
    checkOutTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);


const Attendance = model("Attendance", attendanceSchema);

export default Attendance;
