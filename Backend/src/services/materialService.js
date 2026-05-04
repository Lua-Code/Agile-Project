import Material from "../models/Material.js";

export const createMaterialService = async (data, file, user) => {
    if (!file) {
        const error = new Error("File is required");
        error.statusCode = 400;
        throw error;
    }

    const { courseId, title, description } = data;

    if (!courseId || !title) {
        const error = new Error("Course and title are required");
        error.statusCode = 400;
        throw error;
    }

    return await Material.create({
        courseId,
        uploadedByUserId: user.id,
        title,
        description,
        fileUrl: `/uploads/materials/${file.filename}`,
        fileName: file.originalname,
        fileType: file.mimetype,
    });
};

export const getMaterialsService = async (user) => {
  if (!user) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  let query = { visibility: "published" };

  if (user.role === "professor" || user.role === "ta") {
    query.uploadedByUserId = user.id;
  }

  return await Material.find(query)
    .populate("courseId", "courseCode title")
    .populate("uploadedByUserId", "fullName email")
    .sort({ createdAt: -1 });
};