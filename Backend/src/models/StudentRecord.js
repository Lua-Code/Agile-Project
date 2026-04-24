import mongoose from "mongoose";

const studentRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  grades: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },
      grade: String,
      creditHours: Number
    }
  ],
  gpa: Number
});

export default mongoose.model("StudentRecord", studentRecordSchema);