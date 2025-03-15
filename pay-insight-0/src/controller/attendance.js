import Attendance from "../model/attendance.js";

const handleAddAttendance = async (req, res) => {
    const { employeeId, date, status, checkInGeometry, checkInTime, checkOutGeometry, checkOutTime } = req.body;

    if (!employeeId || !date || !status || !checkInGeometry || !checkInTime || !checkOutGeometry || !checkOutTime) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newAttendance = new Attendance({
            employeeId,
            date,
            status,
            checkInGeometry,
            checkInTime,
            checkOutGeometry,
            checkOutTime,
        });

        await newAttendance.save();
        res.status(201).json({ message: "Attendance added successfully!", attendance: newAttendance });
    } catch (err) {
        res.status(500).json({ message: "Error adding attendance", error: err });
    }
};

export { handleAddAttendance }
