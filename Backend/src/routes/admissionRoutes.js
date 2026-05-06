import express from "express";
import {
  createAdmissionApplication,
  getAdmissionApplications,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";

const router = express.Router();

router.post("/", createAdmissionApplication);
router.get("/", getAdmissionApplications);
router.patch("/:id/status", updateAdmissionStatus);

export default router;