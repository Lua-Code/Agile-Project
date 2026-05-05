import * as messageService from "../services/messageService.js";

// ✅ Send message
export const sendMessage = async (req, res) => {
    try {
        const { sender, senderRole, receiver, receiverRole, message } = req.body;

        if (!sender || !senderRole || !receiver || !receiverRole || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newMessage = await messageService.sendMessage({
            sender,
            senderRole,
            receiver,
            receiverRole,
            message,
        });

        res.status(201).json({
            success: true,
            data: newMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message,
        });
    }
};

// ✅ Get conversation between 2 users
export const getConversation = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        if (!user1 || !user2) {
            return res.status(400).json({
                success: false,
                message: "Both users are required",
            });
        }

        const messages = await messageService.getConversation(user1, user2);

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get conversation",
            error: error.message,
        });
    }
};