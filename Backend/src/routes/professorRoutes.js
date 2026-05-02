import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";
import { getProfessors } from "../controllers/professorController.js";

router.use(requireAuth);

router.get("/", getProfessors);

export default router;
