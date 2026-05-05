import express from "express";
import {
  createEnrollments,
  getEnrollments,
  updateEnrollmentStatus,
} from "../controllers/enrollmentController.js";

const router = express.Router();

router.route("/")
  .post(createEnrollments)
  .get(getEnrollments);

router.route("/:id/status")
  .patch(updateEnrollmentStatus);

export default router;