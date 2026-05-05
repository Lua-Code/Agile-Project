import User from "../models/User.js";

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;

        const users = await User.find({ role }).select("fullName email role");

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: error.message,
        });
    }
};