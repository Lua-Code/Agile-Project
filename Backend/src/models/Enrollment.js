import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["enrolled", "dropped", "completed"],
    default: "enrolled"
  }
});

enrollmentSchema.index({ studentId: 1, courseId: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);