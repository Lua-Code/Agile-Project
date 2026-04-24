import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: String,
    required: true
  },
  officeLocation: String,
  officeHours: [
    {
      day: String,
      startTime: String,
      endTime: String
    }
  ]
});

export default mongoose.model("Professor", professorSchema);