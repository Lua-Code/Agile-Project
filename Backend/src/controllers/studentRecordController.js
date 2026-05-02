import {getTranscriptsService} from "../services/studentRecordService.js";

export const getTranscripts = async (req, res) => {
    try {
        const transcripts = await getTranscriptsService(req.session.user);

        console.log("Transcripts fetched successfully:", transcripts);

        res.status(200).json({ 
            message: "Transcripts fetched successfully",
            transcripts });

    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to fetch transcripts",
        });

    }
};