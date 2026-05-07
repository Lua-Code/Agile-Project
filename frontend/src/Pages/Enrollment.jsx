import { useEffect, useState } from "react";
import api from "../Api/axios";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const { data } = await api.get("/enrollments/requests", {
        withCredentials: true,
      });

      setEnrollments(data || []);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUpdateStatus = async (enrollmentId, status) => {
    try {
      await api.patch(
        `/enrollments/${enrollmentId}/status`,
        { status },
        { withCredentials: true }
      );

      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment._id === enrollmentId
            ? { ...enrollment, status }
            : enrollment
        )
      );
    } catch (err) {
      console.error("Failed to update enrollment:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update enrollment");
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Enrollment Requests</h1>
            <p style={styles.subtitle}>
              Review and approve student course enrollment requests
            </p>
          </div>
        </section>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Requests</p>
            <h2 style={styles.cardNumber}>{enrollments.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Pending</p>
            <h2 style={styles.cardNumber}>
              {enrollments.filter((e) => e.status === "pending").length}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Approved</p>
            <h2 style={styles.cardNumber}>
              {enrollments.filter((e) => e.status === "approved").length}
            </h2>
          </div>
        </section>

        {loading && <p>Loading enrollment requests...</p>}

        {!loading && (
          <section style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Course Code</th>
                  <th style={styles.th}>Course Title</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td style={styles.td}>
                        {enrollment.studentId?.userId?.fullName || "N/A"}
                      </td>

                      <td style={styles.td}>
                        {enrollment.studentId?.userId?.email || "N/A"}
                      </td>

                      <td style={styles.td}>
                        {enrollment.courseId?.courseCode || "N/A"}
                      </td>

                      <td style={styles.td}>
                        {enrollment.courseId?.title || "N/A"}
                      </td>

                      <td style={styles.td}>
                        {enrollment.courseId?.department || "N/A"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            ...(enrollment.status === "approved"
                              ? styles.approvedStatus
                              : enrollment.status === "rejected"
                              ? styles.rejectedStatus
                              : styles.pendingStatus),
                          }}
                        >
                          {enrollment.status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <button
                          style={{
                            ...styles.approveButton,
                            ...(enrollment.status !== "pending"
                              ? styles.disabledButton
                              : {}),
                          }}
                          disabled={enrollment.status !== "pending"}
                          onClick={() =>
                            handleUpdateStatus(enrollment._id, "approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          style={{
                            ...styles.rejectButton,
                            ...(enrollment.status !== "pending"
                              ? styles.disabledButton
                              : {}),
                          }}
                          disabled={enrollment.status !== "pending"}
                          onClick={() =>
                            handleUpdateStatus(enrollment._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan="7">
                      No enrollment requests found.
                    </td>
                  </tr>
                )}
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
    textTransform: "capitalize",
  },
  pendingStatus: {
    background: "#fef3c7",
    color: "#92400e",
  },
  approvedStatus: {
    background: "#dcfce7",
    color: "#15803d",
  },
  rejectedStatus: {
    background: "#fee2e2",
    color: "#b91c1c",
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
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

export default Enrollments;