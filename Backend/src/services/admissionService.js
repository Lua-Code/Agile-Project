import AdmissionApplication from "../models/AdmissionApplication.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createAdmissionApplicationService = async (data) => {
  const {
    fullName,
    email,
    phone,
    dateOfBirth,
    address,
    program,
    department,
    previousSchool,
    graduationYear,
    gpa,
    personalStatement,
  } = data;

  if (!fullName || !email || !phone || !program || !department) {
    const error = new Error("Full name, email, phone, program, and department are required");
    error.statusCode = 400;
    throw error;
  }

  return await AdmissionApplication.create({
    fullName,
    email,
    phone,
    dateOfBirth,
    address,
    program,
    department,
    previousSchool,
    graduationYear,
    gpa,
    personalStatement,
  });
};

export const getAdmissionApplicationsService = async () => {
  return await AdmissionApplication.find().sort({ createdAt: -1 });
};

export const updateAdmissionStatusService = async (
  applicationId,
  status,
  adminUserId,
  reviewNote = ""
) => {
  if (!["accepted", "rejected"].includes(status)) {
    const error = new Error("Invalid application status");
    error.statusCode = 400;
    throw error;
  }

  const application = await AdmissionApplication.findById(applicationId);

  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  if (application.status !== "pending") {
    const error = new Error("Application has already been reviewed");
    error.statusCode = 400;
    throw error;
  }

  application.status = status;
  application.reviewedByUserId = adminUserId;
  application.reviewedAt = new Date();
  application.reviewNote = reviewNote;

  await application.save();

  const emailSubject =
    status === "accepted"
      ? "University Admission Accepted"
      : "University Admission Update";

  const emailText =
    status === "accepted"
      ? `Dear ${application.fullName},

Congratulations! Your admission application has been accepted.

Program: ${application.program}
Department: ${application.department}

Please wait for further onboarding instructions.

University Administration`
      : `Dear ${application.fullName},

We regret to inform you that your admission application has been rejected.

${reviewNote ? `Reason: ${reviewNote}` : ""}

Thank you for applying.

University Administration`;

  await sendEmail({
    to: application.email,
    subject: emailSubject,
    text: emailText,
  });

  return application;
};