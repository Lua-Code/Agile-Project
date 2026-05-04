import * as materialService from "../services/materialService.js";

export const uploadMaterial = async (req, res) => {
  try {
    const material = await materialService.createMaterialService(
      req.body,
      req.file,
      req.session.user
    );

    res.status(201).json({
      message: "Material uploaded successfully",
      material,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Upload failed",
    });
  }
};

export const getMaterials = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const materials = await materialService.getMaterialsService(
      req.session.user
    );

    res.status(200).json({ materials });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch materials",
    });
  }
};