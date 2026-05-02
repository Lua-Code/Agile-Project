import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";

export const requestEnrollmentService = async (userId, courseId) => {
    const student = await Student.findOne({ userId });
    console.log("Student found:", student);

    if (!student) {
        const error = new Error("Student profile not found");
        error.statusCode = 404;
        throw error;
    }

    const semester = "Spring";
    const academicYear = "2026";

    const existingEnrollment = await Enrollment.findOne({
        studentId: userId,
        courseId,
        semester,
        academicYear,
        status: { $in: ["pending", "approved"] },});

    if (existingEnrollment) {
        const error = new Error("You have already requested enrollment for this course in the current semester");
        error.statusCode = 400;
        throw error;
    }

    return await Enrollment.create({
        studentId: student._id,
        courseId: courseId,
        semester : "Spring",
        academicYear : "2026",
        status: "pending"
    });
    await enrollment.save();
}

export const getEnrollmentRequestsService = async () => {
  return await Enrollment.find({ status: "pending" })
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "fullName email",
      },
    })
    .populate("courseId", "courseCode title type department")
    .sort({ createdAt: -1 });
};

export const getMyEnrollmentRequestsService = async (userId) => {
  const student = await Student.findOne({ userId });

  if (!student) {
    const error = new Error("Student profile not found");
    error.statusCode = 404;
    throw error;
  }

  return await Enrollment.find({
    studentId: student._id,
    status: { $in: ["pending", "approved"] },
  }).select("courseId status");
};