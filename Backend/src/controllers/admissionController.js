import * as admissionService from "../services/admissionService.js";

export const createAdmissionApplication = async (req, res) => {
  try {
    const application =
      await admissionService.createAdmissionApplicationService(req.body);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to submit application",
    });
  }
};

export const getAdmissionApplications = async (req, res) => {
  try {
    if (req.session.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can view admission applications",
      });
    }

    const applications =
      await admissionService.getAdmissionApplicationsService();

    res.status(200).json({ applications });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch applications",
    });
  }
};

export const updateAdmissionStatus = async (req, res) => {
  try {
    if (req.session.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can review admission applications",
      });
    }

    const { status, reviewNote } = req.body;

    const application =
      await admissionService.updateAdmissionStatusService(
        req.params.id,
        status,
        req.session.user.id,
        reviewNote
      );

    res.status(200).json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to update application status",
    });
  }
};