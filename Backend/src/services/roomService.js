import Room from "../models/Room.js";

export const getRoomsService = async () => {
  return await Room.find().sort({ roomNumber: 1 });
};