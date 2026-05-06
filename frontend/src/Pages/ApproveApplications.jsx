import { useEffect, useState } from "react";
import api from "../Api/axios";

function ApproveApplications() {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get("/admissions", {
                    withCredentials: true,
                });

                setApplications(data.applications || []);
            } catch (err) {
                console.error("Failed to fetch applications:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const updateApplicationStatus = async (applicationId, status, reviewNote = "") => {
        try {
            const { data } = await api.patch(
                `/admissions/${applicationId}/status`,
                { status, reviewNote },
                { withCredentials: true }
            );

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? data.application : app
                )
            );

            alert(data.message || `Application ${status}`);
        } catch (err) {
            console.error("Failed to update application:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to update application");
        }
    };

    const handleApprove = (applicationId) => {
        updateApplicationStatus(applicationId, "accepted");
    };

    const handleReject = (applicationId) => {
        const reviewNote = window.prompt("Reason for rejection:");

        updateApplicationStatus(applicationId, "rejected", reviewNote);
    };
    return (
        <div style={styles.page}>
            <main style={styles.main}>
                <section style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Admission Applications</h1>
                        <p style={styles.subtitle}>
                            Review submitted applications and approve or reject applicants
                        </p>
                    </div>
                </section>

                <section style={styles.cards}>
                    <div style={styles.card}>
                        <p style={styles.cardLabel}>Total Applications</p>
                        <h2 style={styles.cardNumber}>{applications.length}</h2>
                    </div>

                    <div style={styles.card}>
                        <p style={styles.cardLabel}>Pending</p>
                        <h2 style={styles.cardNumber}>
                            {applications.filter((a) => a.status === "pending").length}
                        </h2>
                    </div>

                    <div style={styles.card}>
                        <p style={styles.cardLabel}>Accepted</p>
                        <h2 style={styles.cardNumber}>
                            {applications.filter((a) => a.status === "accepted").length}
                        </h2>
                    </div>
                </section>

                {loading && <p>Loading applications...</p>}

                {!loading && (
                    <section style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Applicant</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Phone</th>
                                    <th style={styles.th}>Program</th>
                                    <th style={styles.th}>Department</th>
                                    <th style={styles.th}>GPA/Score</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Details</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id}>
                                        <td style={styles.td}>{app.fullName}</td>
                                        <td style={styles.td}>{app.email}</td>
                                        <td style={styles.td}>{app.phone}</td>
                                        <td style={styles.td}>{app.program}</td>
                                        <td style={styles.td}>{app.department}</td>
                                        <td style={styles.td}>{app.gpa || "N/A"}</td>
                                        <td style={styles.td}>
                                            <span style={styles.status}>{app.status}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.viewButton}
                                                onClick={() => setSelectedApplication(app)}
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={{
                                                    ...styles.approveButton,
                                                    ...(app.status !== "pending" ? styles.disabledButton : {}),
                                                }}
                                                disabled={app.status !== "pending"}
                                                onClick={() => handleApprove(app._id)}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                style={{
                                                    ...styles.rejectButton,
                                                    ...(app.status !== "pending" ? styles.disabledButton : {}),
                                                }}
                                                disabled={app.status !== "pending"}
                                                onClick={() => handleReject(app._id)}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {selectedApplication && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2 style={styles.sectionTitle}>Application Details</h2>

                            {Object.entries(selectedApplication).map(([key, value]) => (
                                <p key={key} style={styles.detailRow}>
                                    <strong>{key}: </strong>
                                    {value ? String(value) : "N/A"}
                                </p>
                            ))}

                            <button
                                style={styles.rejectButton}
                                onClick={() => setSelectedApplication(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
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
    header: {
        marginBottom: "28px",
    },
    title: {
        margin: 0,
        fontSize: "38px",
        color: "#0f172a",
    },
    subtitle: {
        marginTop: "8px",
        color: "#64748b",
        fontSize: "16px",
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "22px",
        marginBottom: "24px",
    },
    card: {
        background: "#ffffff",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e2e8f0",
    },
    cardLabel: {
        margin: 0,
        color: "#64748b",
        fontWeight: "600",
    },
    cardNumber: {
        margin: "12px 0 0",
        fontSize: "34px",
        color: "#0f172a",
    },
    tableCard: {
        background: "#ffffff",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        textAlign: "center",
        padding: "16px",
        color: "#475569",
        borderBottom: "1px solid #e2e8f0",
    },
    td: {
        padding: "16px",
        borderBottom: "1px solid #e2e8f0",
        textAlign: "center",
    },
    status: {
        padding: "6px 12px",
        borderRadius: "999px",
        fontWeight: "700",
        fontSize: "13px",
        display: "inline-block",
        background: "#fef3c7",
        color: "#92400e",
    },
    approveButton: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "#dcfce7",
        color: "#15803d",
        fontWeight: "700",
        cursor: "pointer",
        marginRight: "8px",
    },
    rejectButton: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "#fee2e2",
        color: "#b91c1c",
        fontWeight: "700",
        cursor: "pointer",
    },
    viewButton: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "#dbeafe",
        color: "#1d4ed8",
        fontWeight: "700",
        cursor: "pointer",
    },
    disabledButton: {
        opacity: 0.5,
        cursor: "not-allowed",
    },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },

    modal: {
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
    },

    detailRow: {
        margin: "10px 0",
        color: "#334155",
    },
};

export default ApproveApplications;