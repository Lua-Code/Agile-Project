import { useState, useEffect } from "react";
import api from "../Api/axios";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Enrollment() {
  const { user } = useAuthContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "student")) return;
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const endpoint =
        user.role === "admin"
          ? "/enrollments/requests"
          : "/enrollments/requests/my-requests";
      const { data } = await api.get(endpoint, { withCredentials: true });
      setRequests(data);
    } catch (err) {
      setError("Failed to fetch enrollment requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/enrollments/${id}/status`, { status }, { withCredentials: true });
      // Remove the processed request from the UI
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "student")) {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>Enrollment</h1>
              <p style={styles.subtitle}>This is the Enrollment page.</p>
            </div>
          </header>
        </main>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {isAdmin ? "Enrollment Requests" : "My Enrollments"}
            </h1>
            <p style={styles.subtitle}>
              {isAdmin
                ? "Review and manage pending student course enrollments."
                : "View the status of your enrolled courses."}
            </p>
          </div>
        </header>

        {loading && <p>Loading requests...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {!loading && !error && requests.length === 0 && (
          <div style={styles.tableCard}>
            <p style={{ textAlign: "center", color: "#64748b" }}>
              {isAdmin
                ? "No pending enrollment requests."
                : "You have not enrolled in any courses yet."}
            </p>
          </div>
        )}

        {!loading && !error && requests.length > 0 && (
          <section style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {isAdmin ? (
                    <>
                      <th style={styles.th}>Student Name</th>
                      <th style={styles.th}>Student Email</th>
                      <th style={styles.th}>Course Code</th>
                      <th style={styles.th}>Course Title</th>
                      <th style={styles.th}>Actions</th>
                    </>
                  ) : (
                    <>
                      <th style={styles.th}>Course Code</th>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Credits</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    {isAdmin ? (
                      <>
                        <td style={styles.td}>
                          {req.studentId?.userId?.fullName || "N/A"}
                        </td>
                        <td style={styles.td}>
                          {req.studentId?.userId?.email || "N/A"}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.courseCodeBadge}>
                            {req.courseId?.courseCode || "N/A"}
                          </span>
                        </td>
                        <td style={styles.td}>{req.courseId?.title || "N/A"}</td>
                        <td style={styles.td}>
                          <button
                            style={styles.approveButton}
                            onClick={() => handleStatusUpdate(req._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            style={styles.rejectButton}
                            onClick={() => handleStatusUpdate(req._id, "rejected")}
                          >
                            Reject
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={styles.td}>
                          <span style={styles.courseCodeBadge}>
                            {req.courseId?.courseCode || "N/A"}
                          </span>
                        </td>
                        <td style={styles.td}>{req.courseId?.title || "N/A"}</td>
                        <td style={styles.td}>{req.courseId?.department || "N/A"}</td>
                        <td style={styles.td}>{req.courseId?.creditHours || "N/A"}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.typeBadge,
                              background:
                                req.courseId?.type === "Core" || req.courseId?.type === "core"
                                  ? "#e2e8f0"
                                  : "#fef3c7",
                            }}
                          >
                            {req.courseId?.type === "core" || req.courseId?.type === "Core" ? "Core" : "Elective"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "bold",
                              color:
                                req.status === "approved"
                                  ? "#15803d"
                                  : req.status === "rejected"
                                  ? "#b91c1c"
                                  : "#b45309",
                            }}
                          >
                            {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : "N/A"}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    height: "100%",
  },

  main: {
    flex: 1,
    padding: "36px",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    textAlign: "left",
    padding: "16px",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#0f172a",
  },

  courseCodeBadge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px",
  },

  typeBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
    display: "inline-block",
  },

  approveButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#dcfce7",
    color: "#15803d",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "8px",
  },

  rejectButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
    cursor: "pointer",
  },
};