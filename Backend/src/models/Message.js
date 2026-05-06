import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        senderRole: {
            type: String,
            enum: ["student", "professor"],
            required: true,
        },
        receiver: {
            type: String,
            required: true,
        },
        receiverRole: {
            type: String,
            enum: ["student", "professor"],
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);