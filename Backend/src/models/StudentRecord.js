import mongoose from "mongoose";

const studentRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    grades: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        grade: {
          type: String,
          default: null,
        },
        creditHours: {
          type: Number,
          required: true,
        },
      },
    ],
    gpa: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

studentRecordSchema.index(
  { studentId: 1, academicYear: 1, semester: 1 },
  { unique: true }
);

export default mongoose.model("StudentRecord", studentRecordSchema);