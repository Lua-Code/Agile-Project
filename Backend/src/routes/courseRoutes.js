import express from "express";
const router = express.Router();
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  checkCourseCode,
  getMyCourses
} from "../controllers/courseController.js";

router.use(requireAuth);

router.get("/check-code", checkCourseCode);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", requireRole("admin"), createCourse);
router.put("/:id", requireRole("admin"), updateCourse);
router.delete("/:id", requireRole("admin"), deleteCourse);
router.get("/my-courses", getMyCourses);

export default router;