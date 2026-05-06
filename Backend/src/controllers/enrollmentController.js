import * as enrollmentService from "../services/enrollmentService.js";
import { requestEnrollmentService, getEnrollmentRequestsService, getMyEnrollmentRequestsService, updateEnrollmentStatusService } from "../services/enrollmentService.js";

export const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    next(error);
  }
};

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

export const requestEnrollment = async (req, res) => {
    try {
        const enrollment = await requestEnrollmentService(
            req.session.user.id,
            req.params.courseId
        );

        res.status(201).json({
            message: "Enrollment request submitted",
            enrollment,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to request enrollment",
        });
    }
};

export const getEnrollmentRequests = async (req, res) => {
    try {
        const requests = await getEnrollmentRequestsService();

        res.status(200).json(requests);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to fetch enrollment requests",
        });
    }
};

export const getMyEnrollmentRequests = async (req, res) => {
    try {
        const requests = await getMyEnrollmentRequestsService(
            req.session.user.id
        );

        res.status(200).json(requests);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to fetch enrollment requests",
        });
    }
};

export const updateEnrollmentStatus = async (req, res) => {
    try {
        const enrollment = await updateEnrollmentStatusService(
            req.params.id,
            req.body.status
        );
        res.status(200).json({
            message: "Enrollment status updated successfully",
            enrollment,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to update enrollment status",
        });
    }
};
