import express from "express";
const router = express.Router();

import adminRoutes from "./adminRoutes.js";
import announcementRoutes from "./announcementRoutes.js";
import authRoutes from "./authRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import courseRoutes from "./courseRoutes.js";
import enrollmentRoutes from "./enrollmentRoutes.js";
import professorRoutes from "./professorRoutes.js";
import roomRoutes from "./roomRoutes.js";
import studentRoutes from "./studentRoutes.js";
import studentRecordsRoutes from "./studentRecordRoutes.js";
import UserRoutes from "./userRoutes.js";
import materialRoutes from "./materialRoutes.js";
import resourceRoutes from "./resourceRoutes.js";

router.use("/admin", adminRoutes);
router.use("/announcements", announcementRoutes);
router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/professors", professorRoutes);
router.use("/rooms", roomRoutes);
router.use("/students", studentRoutes);
router.use("/student-records", studentRecordsRoutes);
router.use("/users", UserRoutes);
router.use("/materials", materialRoutes);
router.use("/resources", resourceRoutes);

export default router;