import { requestEnrollmentService, getEnrollmentRequestsService, getMyEnrollmentRequestsService } from "../services/enrollmentService.js";

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