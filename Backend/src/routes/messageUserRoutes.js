import express from "express";
import { getUsersByRole } from "../controllers/messageUserController.js";

const router = express.Router();

router.get("/:role", getUsersByRole);

export default router;