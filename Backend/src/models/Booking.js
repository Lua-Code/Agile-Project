import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  bookedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bookedByRole: {
    type: String,
    enum: ["student", "professor", "admin"],
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }
});

export default mongoose.model("Booking", bookingSchema);