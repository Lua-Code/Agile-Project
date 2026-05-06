import mongoose from "mongoose";

const hrSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  baseSalary: {
    type: Number,
    required: true,
    default: 0,
  },
  leaveBalance: {
    vacation: { type: Number, default: 15 },
    sick: { type: Number, default: 10 },
    personal: { type: Number, default: 5 },
  },
  leaveRequests: [
    {
      type: {
        type: String,
        enum: ["vacation", "sick", "personal"],
        required: true,
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      reason: { type: String, default: "" },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
  ],
  payHistory: [
    {
      month: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  benefits: [
    {
      name: { type: String, required: true },
      coverage: { type: String, required: true },
    },
  ],
}, { timestamps: true });

export default mongoose.model("HR", hrSchema);
