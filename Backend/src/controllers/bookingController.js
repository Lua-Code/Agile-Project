import * as bookingService from "../services/bookingService.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBookingService(
      req.body,
      req.session.user
    );

    res.status(201).json({
      message: "Room booked successfully",
      booking,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Booking failed",
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getBookingsService(req.session.user);

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch bookings",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBookingService(
      req.params.id,
      req.session.user
    );

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to cancel booking",
    });
  }
};