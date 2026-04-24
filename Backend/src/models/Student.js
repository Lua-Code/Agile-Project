import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  yearLevel: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive", "graduated"],
    default: "active"
  }
});

export default mongoose.model("Student", studentSchema);