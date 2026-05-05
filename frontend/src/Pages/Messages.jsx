import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function Messages() {
    const { user } = useAuthContext();

    const currentUser = user?.fullName || user?.email;
    const currentRole = user?.role;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedUserName, setSelectedUserName] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const oppositeRole = currentRole === "student" ? "professor" : "student";

    useEffect(() => {
        const fetchUsers = async () => {
            if (!oppositeRole) return;

            try {
                const res = await fetch(
                    `http://localhost:5000/api/message-users/${oppositeRole}`
                );

                const data = await res.json();

                if (data.success) {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [oppositeRole]);

    const fetchConversation = async () => {
        if (!currentUser || !selectedUserName) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/messages/conversation/${currentUser}/${selectedUserName}`
            );

            const data = await res.json();

            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch conversation:", error);
        }
    };

    useEffect(() => {
        fetchConversation();

        const interval = setInterval(fetchConversation, 3000);

        return () => clearInterval(interval);
    }, [currentUser, selectedUserName]);

    const handleUserSelect = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        setMessages([]);

        const chosenUser = users.find((u) => u._id === userId);

        if (chosenUser) {
            setSelectedUserName(chosenUser.fullName || chosenUser.email);
        } else {
            setSelectedUserName("");
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!message.trim() || !selectedUserName) return;

        try {
            const res = await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: currentUser,
                    senderRole: currentRole,
                    receiver: selectedUserName,
                    receiverRole: oppositeRole,
                    message,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage("");
                fetchConversation();
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (!user) return <p className="p-6">Loading...</p>;

    return (
        <div className="min-h-screen bg-[#e0e1dd] p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#1b263b] mb-2 text-center">
                    Messages
                </h2>

                <p className="mb-2 text-[#415a77] text-center">
                    Logged in as: <strong>{currentRole}</strong>
                </p>

                <div className="mb-5">
                    <label className="block mb-2 font-medium text-[#415a77] text-center">
                        {currentRole === "student" ? "Choose Professor" : "Choose Student"}
                    </label>

                    <select
                        value={selectedUser}
                        onChange={handleUserSelect}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <option value="">Select user</option>

                        {users.map((person) => (
                            <option key={person._id} value={person._id}>
                                {person.fullName || person.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="h-96 overflow-y-auto border border-[#415a77] rounded-lg p-4 bg-gray-50 mb-5">
                    {!selectedUserName ? (
                        <p className="text-gray-500 text-center">
                            Select a user to start chatting.
                        </p>
                    ) : messages.length === 0 ? (
                        <p className="text-gray-500 text-center">No messages yet.</p>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.sender === currentUser;

                            return (
                                <div
                                    key={msg._id}
                                    className={`mb-3 p-3 rounded-lg max-w-md ${isMine ? "ml-auto" : "mr-auto"
                                        }`}
                                    style={{
                                        backgroundColor: isMine ? "#415a77" : "#ffffff",
                                        color: isMine ? "#ffffff" : "#1b263b",
                                        border: isMine ? "none" : "1px solid #1b263b",
                                    }}
                                >
                                    <p style={{ color: isMine ? "#ffffff" : "#1b263b", fontWeight: "600" }}>
                                        {msg.sender}
                                    </p>

                                    <p style={{ color: isMine ? "#ffffff" : "#1b263b" }}>
                                        {msg.message}
                                    </p>

                                    <p
                                        style={{
                                            color: isMine ? "#e5e7eb" : "#64748b",
                                            fontSize: "12px",
                                            marginTop: "4px",
                                        }}
                                    >
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>

                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                            selectedUserName ? "Type your message..." : "Select a user first..."
                        }
                        disabled={!selectedUserName}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                    />

                    <button
                        type="submit"
                        disabled={!selectedUserName}
                        className="bg-[#415a77] hover:bg-[#1b263b] text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Messages;