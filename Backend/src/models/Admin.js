import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: String,
    required: true
  },
  permissions: [String]
});

export default mongoose.model("Admin", adminSchema);