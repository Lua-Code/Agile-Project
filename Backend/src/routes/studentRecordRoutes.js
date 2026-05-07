import express from "express";
const router = express.Router();

import { getTranscripts,getMyChildProgress } from "../controllers/studentRecordController.js";

router.get("/transcripts", getTranscripts);
router.get("/my-child-progress", getMyChildProgress);


export default router;