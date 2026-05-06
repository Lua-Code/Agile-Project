import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Room from "../models/Room.js";
import Enrollment from "../models/Enrollment.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalStudents, totalCourses, availableRooms, totalEnrollments] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Room.countDocuments({ status: "active" }),
      Enrollment.countDocuments({ status: "approved" }),
    ]);

    res.json({ totalStudents, totalCourses, availableRooms, totalEnrollments });
  } catch (err) {
    next(err);
  }
};
