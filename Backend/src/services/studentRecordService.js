import StudentRecord from "../models/StudentRecord.js";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
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

export const getStudentProgressForParentService = async (parentUserId) => {
  console.log("Fetching student progress for parent user ID:", parentUserId);
  const parent = await Parent.findOne({ userId: parentUserId });

  if (!parent) {
    const error = new Error("Parent profile not found");
    error.statusCode = 404;
    throw error;
  }

  const student = await Student.findOne({ _id: parent.studentId }).populate(
    "userId",
    "fullName email"
  );

  if (!student) {
    const error = new Error("Linked student not found");
    error.statusCode = 404;
    throw error;
  }

  const records = await StudentRecord.find({ studentId: student._id })
    .populate("grades.courseId", "courseCode title creditHours")
    .sort({ academicYear: -1, semester: 1 });

  return {
    student,
    records,
  };
};