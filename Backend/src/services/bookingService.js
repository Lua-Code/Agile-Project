import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const createBookingService = async (bookingData, user) => {
  const { roomId, purpose, startDateTime, endDateTime } = bookingData;

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (!roomId || !purpose || !startDateTime || !endDateTime) {
    const error = new Error("All booking fields are required");
    error.statusCode = 400;
    throw error;
  }

  if (start >= end) {
    const error = new Error("End time must be after start time");
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findOne({
    _id: roomId,
    status: "active",
  });

  if (!room) {
    const error = new Error("Room not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const conflictingBooking = await Booking.findOne({
    roomId,
    status: "booked",
    startDateTime: { $lt: end },
    endDateTime: { $gt: start },
  });

  if (conflictingBooking) {
    const error = new Error("Room is already booked during this time");
    error.statusCode = 400;
    throw error;
  }

  return await Booking.create({
    roomId,
    bookedByUserId: user.id,
    bookedByRole: user.role,
    purpose,
    startDateTime: start,
    endDateTime: end,
    status: "booked",
  });
};

export const getBookingsService = async (user) => {
  const query = { status: "booked" };

  if (user.role === "professor" || user.role === "ta") {
    query.bookedByUserId = user.id;
  }

  return await Booking.find(query)
    .populate("roomId", "roomNumber building type capacity")
    .populate("bookedByUserId", "fullName email role")
    .sort({ startDateTime: 1 });
};

export const cancelBookingService = async (bookingId, user) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = booking.bookedByUserId.toString() === user.id;
  const isAdmin = user.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("You are not allowed to cancel this booking");
    error.statusCode = 403;
    throw error;
  }

  booking.status = "cancelled";
  await booking.save();

  return booking;
};