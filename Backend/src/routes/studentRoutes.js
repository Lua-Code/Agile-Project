import express from "express";
const router = express.Router();
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { createStudent, getStudents } from "../controllers/studentController.js";

router.use(requireAuth);

router.get("/", getStudents);
router.post("/", requireRole("admin"), createStudent);

export default router;
