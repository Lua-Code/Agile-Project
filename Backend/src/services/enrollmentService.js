import Enrollment from "../models/Enrollment.js";

export const createEnrollment = async (studentId, courseIds, semester, academicYear) => {
  // Create an array of enrollment documents to insert
  const enrollments = courseIds.map((courseId) => ({
    studentId,
    courseId,
    semester,
    academicYear,
    status: "pending",
  }));

  return await Enrollment.insertMany(enrollments, { ordered: false });
};

export const getAllEnrollments = async () => {
  return await Enrollment.find()
    .populate("studentId", "firstName lastName studentIdNumber")
    .populate("courseId", "courseCode title creditHours department type")
    .sort({ createdAt: -1 });
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  return await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { status },
    { new: true, runValidators: true }
  );
};
