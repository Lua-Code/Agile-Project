import StudentRecord from "../models/StudentRecord.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

export const getTranscriptsService = async (user) => {
  let query = {};

  if (user.role === "student") {
    const student = await Student.findOne({ userId: user.id });

    if (!student) {
      const error = new Error("Student profile not found");
      error.statusCode = 404;
      throw error;
    }

    query.studentId = student._id;
  }

  const transcripts = await StudentRecord.find(query)
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "fullName email",
      },
      select: "studentId userId department program yearLevel status",
    })
    .populate("grades.courseId", "courseCode title creditHours")
    .sort({ createdAt: -1 });

  return transcripts;
};