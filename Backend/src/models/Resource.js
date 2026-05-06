import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["equipment", "lab-tool", "furniture", "other"],
      default: "equipment",
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    condition: {
      type: String,
      enum: ["new", "good", "needs-maintenance", "damaged"],
      default: "good",
    },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance"],
      default: "available",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);