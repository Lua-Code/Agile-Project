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

    let enrollment = await Enrollment.findOne({
        studentId: student._id,
        courseId,
        semester,
        academicYear
    });

    if (enrollment) {
        if (["pending", "approved", "completed"].includes(enrollment.status)) {
            const error = new Error(`You have already requested enrollment for this course (${enrollment.status})`);
            error.statusCode = 400;
            throw error;
        }
        
        // If rejected or dropped, update to pending
        enrollment.status = "pending";
        await enrollment.save();
        return enrollment;
    }

    return await Enrollment.create({
        studentId: student._id,
        courseId: courseId,
        semester : "Spring",
        academicYear : "2026",
        status: "pending"
    });
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
  }).populate("courseId", "courseCode title type department creditHours")
    .select("courseId status semester academicYear");
};

export const updateEnrollmentStatusService = async (id, status) => {
  const validStatuses = ["approved", "rejected"];
  
  if (!validStatuses.includes(status)) {
      const error = new Error("Invalid status update");
      error.statusCode = 400;
      throw error;
  }
  
  const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
  );

  if (!enrollment) {
      const error = new Error("Enrollment not found");
      error.statusCode = 404;
      throw error;
  }

  return enrollment;
};
