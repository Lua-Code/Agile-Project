import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

router.use(requireAuth);

router.get("/", getAnnouncements);
router.post("/", authorizeRoles("admin"), createAnnouncement);
router.delete("/:id", authorizeRoles("admin"), deleteAnnouncement);

export default router;
