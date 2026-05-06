import * as roomService from "../services/roomService.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getRoomsService();

    res.status(200).json({ rooms });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to fetch rooms",
    });
  }
};