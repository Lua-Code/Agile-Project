import express from "express";
const router = express.Router();

import { getTranscripts } from "../controllers/studentRecordController.js";

router.get("/transcripts", getTranscripts);


export default router;