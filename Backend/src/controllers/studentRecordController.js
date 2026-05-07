import {getTranscriptsService, getStudentProgressForParentService} from "../services/studentRecordService.js";

export const getTranscripts = async (req, res) => {
    try {
        const transcripts = await getTranscriptsService(req.session.user);

        res.status(200).json({ 
            message: "Transcripts fetched successfully",
            transcripts });

    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to fetch transcripts",
        });

    }
};

export const getMyChildProgress = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.session.user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can view child progress",
      });
    }

    const data = await getStudentProgressForParentService(
      req.session.user.id
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch student progress",
    });
  }
}; 