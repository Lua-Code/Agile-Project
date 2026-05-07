import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,
  },
  contactNumber : {
    type: String,
    required: true
  }
});

export default mongoose.model("Parent", parentSchema);