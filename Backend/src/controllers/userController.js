import * as userService from "../services/userService.js";

export const getProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await userService.getProfileService(req.session.user.id);

    res.status(200).json({ user });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch profile",
    });
  }
};