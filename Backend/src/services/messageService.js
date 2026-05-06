import Message from "../models/Message.js";

// create message
export const sendMessage = async (data) => {
    return await Message.create(data);
};

// get conversation
export const getConversation = async (user1, user2) => {
    return await Message.find({
        $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
        ],
    }).sort({ createdAt: 1 });
};