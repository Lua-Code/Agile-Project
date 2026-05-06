import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadMaterial,getMaterials } from "../controllers/materialController.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadMaterial);
router.get("/", getMaterials);

export default router;