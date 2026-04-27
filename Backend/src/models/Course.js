import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ["core", "elective"],
    required: true
  },
  creditHours: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professor"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
});

export default mongoose.model("Course", courseSchema);