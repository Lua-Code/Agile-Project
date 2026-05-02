import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  checkCourseCode,
} from "../controllers/courseController.js";

router.use(requireAuth);

router.get("/check-code", checkCourseCode);
router.get("/", getCourses);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;