import express from "express";
import { requestEnrollment, getEnrollmentRequests,getMyEnrollmentRequests } from "../controllers/enrollmentController.js";
const router = express.Router();

router.post("/request/:courseId", requestEnrollment);
router.get("/requests", getEnrollmentRequests);
router.get("/requests/my-requests",getMyEnrollmentRequests);

export default router;