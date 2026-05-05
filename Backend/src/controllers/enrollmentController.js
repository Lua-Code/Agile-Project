import * as enrollmentService from "../services/enrollmentService.js";

export const createEnrollments = async (req, res, next) => {
  try {
    const { studentId, courseIds, semester, academicYear } = req.body;
    
    if (!studentId || !courseIds || courseIds.length === 0 || !semester || !academicYear) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const enrollments = await enrollmentService.createEnrollment(studentId, courseIds, semester, academicYear);
    res.status(201).json({ success: true, data: enrollments });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "One or more enrollments already exist." });
    }
    next(error);
  }
};

export const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "enrolled", "dropped", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const enrollment = await enrollmentService.updateEnrollmentStatus(id, status);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};
