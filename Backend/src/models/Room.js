import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  building: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["classroom", "lab"],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
});

export default mongoose.model("Room", roomSchema);