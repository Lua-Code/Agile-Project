import express from "express";
import { requestEnrollment, getEnrollmentRequests, getMyEnrollmentRequests, updateEnrollmentStatus } from "../controllers/enrollmentController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(requireAuth);

router.post("/request/:courseId", requestEnrollment);
router.get("/requests", requireRole("admin"), getEnrollmentRequests);
router.get("/requests/my-requests", getMyEnrollmentRequests);
router.put("/:id/status", requireRole("admin"), updateEnrollmentStatus);

export default router;
