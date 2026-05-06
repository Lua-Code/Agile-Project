import * as resourceService from "../services/resourceService.js";

export const getResources = async (req, res) => {
  try {
    const resources = await resourceService.getResourcesService();

    res.status(200).json({ resources });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch resources",
    });
  }
};

export const createResource = async (req, res) => {
  try {
    if (req.session.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can assign resources",
      });
    }

    const resource = await resourceService.createResourceService(req.body);

    res.status(201).json({
      message: "Resource assigned successfully",
      resource,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to assign resource",
    });
  }
};