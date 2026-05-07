import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../Api/axios";

function Messages() {
    const { user } = useAuthContext();

    const currentUser = user?.fullName || user?.email;
    const currentRole = user?.role;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedUserName, setSelectedUserName] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const oppositeRole =
        currentRole === "student"
            ? "professor"
            : currentRole === "professor" || currentRole === "ta"
                ? "student"
                : "";

    useEffect(() => {
        const fetchUsers = async () => {
            if (!oppositeRole) return;

            try {
                const { data } = await api.get(`/message-users/${oppositeRole}`, {
                    withCredentials: true,
                });

                if (data.success) setUsers(data.data);
            } catch (error) {
                console.error("Failed to fetch users:", error.response?.data || error.message);
            }
        };

        fetchUsers();
    }, [oppositeRole]);

    const fetchConversation = async () => {
        if (!currentUser || !selectedUserName) return;

        try {
            const { data } = await api.get(
                `/messages/conversation/${encodeURIComponent(currentUser)}/${encodeURIComponent(selectedUserName)}`,
                { withCredentials: true }
            );

            if (data.success) setMessages(data.data);
        } catch (error) {
            console.error("Failed to fetch conversation:", error.response?.data || error.message);
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
        setSelectedUserName(chosenUser?.fullName || chosenUser?.email || "");
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!message.trim() || !selectedUserName) return;

        try {
            const { data } = await api.post(
                "/messages/send",
                {
                    sender: currentUser,
                    senderRole: currentRole,
                    receiver: selectedUserName,
                    receiverRole: oppositeRole,
                    message,
                },
                { withCredentials: true }
            );

            if (data.success) {
                setMessage("");
                fetchConversation();
            }
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    };

    if (!user) return <p style={{ padding: "36px" }}>Loading...</p>;

    return (
        <div style={styles.page}>
            <main style={styles.main}>
                <section style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Messages</h1>
                        <p style={styles.subtitle}>
                            Communicate with {currentRole === "student" ? "professors" : "students"}
                        </p>
                    </div>
                </section>

                <section style={styles.formCard}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            {currentRole === "student" ? "Choose Professor" : "Choose Student"}
                        </label>

                        <select
                            value={selectedUser}
                            onChange={handleUserSelect}
                            style={styles.input}
                        >
                            <option value="">Select user</option>
                            {users.map((person) => (
                                <option key={person._id} value={person._id}>
                                    {person.fullName || person.email}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section style={styles.chatCard}>
                    <div style={styles.chatHeader}>
                        <h2 style={styles.sectionTitle}>
                            {selectedUserName || "Conversation"}
                        </h2>
                        <span style={styles.roleBadge}>{currentRole}</span>
                    </div>

                    <div style={styles.messagesBox}>
                        {!selectedUserName ? (
                            <p style={styles.emptyText}>Select a user to start chatting.</p>
                        ) : messages.length === 0 ? (
                            <p style={styles.emptyText}>No messages yet.</p>
                        ) : (
                            messages.map((msg) => {
                                const isMine = msg.sender === currentUser;

                                return (
                                    <div
                                        key={msg._id}
                                        style={{
                                            ...styles.messageBubble,
                                            ...(isMine ? styles.myMessage : styles.theirMessage),
                                        }}
                                    >
                                        <p
                                            style={{
                                                ...styles.messageSender,
                                                color: isMine ? "#ffffff" : "#1b263b",
                                            }}
                                        >
                                            {msg.sender}
                                        </p>

                                        <p
                                            style={{
                                                ...styles.messageText,
                                                color: isMine ? "#e0e1dd" : "#334155",
                                            }}
                                        >
                                            {msg.message}
                                        </p>

                                        <p
                                            style={{
                                                ...styles.messageTime,
                                                color: isMine ? "#cbd5e1" : "#64748b",
                                            }}
                                        >
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <form onSubmit={handleSend} style={styles.sendForm}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={
                                selectedUserName ? "Type your message..." : "Select a user first..."
                            }
                            disabled={!selectedUserName}
                            style={styles.messageInput}
                        />

                        <button
                            type="submit"
                            disabled={!selectedUserName}
                            style={{
                                ...styles.primaryButton,
                                ...(!selectedUserName ? styles.disabledButton : {}),
                            }}
                        >
                            Send
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
    },
    main: {
        flex: 1,
        padding: "36px",
    },
    header: { marginBottom: "28px" },
    title: { margin: 0, fontSize: "38px", color: "#0f172a" },
    subtitle: { marginTop: "8px", color: "#64748b" },

    formCard: {
        background: "#fff",
        borderRadius: "22px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 15px 35px rgba(15,23,42,0.08)",
        border: "1px solid #e2e8f0",
    },

    field: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontWeight: "700", color: "#475569" },
    input: {
        padding: "13px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
    },

    chatCard: {
        background: "#fff",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 15px 35px rgba(15,23,42,0.08)",
    },

    chatHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "18px",
    },

    sectionTitle: { fontSize: "22px", color: "#0f172a" },

    roleBadge: {
        background: "#dbeafe",
        padding: "6px 12px",
        borderRadius: "999px",
        fontWeight: "700",
    },

    messagesBox: {
        height: "420px",
        overflowY: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "18px",
    },

    emptyText: { textAlign: "center", color: "#64748b", marginTop: "160px" },

    messageBubble: {
        maxWidth: "520px",
        padding: "12px 16px",
        borderRadius: "14px",
        marginBottom: "12px",
        textAlign: "left",
    },

    myMessage: {
        marginLeft: "auto",
        background: "#1b263b",
        color: "#ffffff",
        border: "none",
    },

    theirMessage: {
        marginRight: "auto",
        background: "#f8fafc",
        color: "#0f172a",
        border: "1px solid #cbd5e1",
    },

    messageSender: { fontWeight: "700" },
    messageText: {},
    messageTime: { fontSize: "12px", opacity: 0.7 },

    sendForm: { display: "flex", gap: "12px" },

    messageInput: {
        flex: 1,
        padding: "13px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
    },

    primaryButton: {
        padding: "12px 24px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #2563eb, #38bdf8)",
        color: "#fff",
        fontWeight: "700",
    },

    disabledButton: {
        opacity: 0.5,
        cursor: "not-allowed",
    },
};

export default Messages;