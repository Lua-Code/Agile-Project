import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

router.use(requireAuth);

router.get("/stats", getDashboardStats);

export default router;