import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";
import { getMyProfile, submitLeave } from "../controllers/hrController.js";

router.use(requireAuth);

router.get("/me", getMyProfile);
router.post("/leave", submitLeave);

export default router;
