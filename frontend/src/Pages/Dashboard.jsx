import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../Api/axios";

function Dashboard() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/admin/stats", { withCredentials: true })
      .then((res) => setStats(res.data))
      .catch(() => {});

    api
      .get("/announcements", { withCredentials: true })
      .then((res) => setAnnouncements(res.data))
      .catch(() => setError("Failed to load announcements."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(
        "/announcements",
        { title, description },
        { withCredentials: true }
      );
      setAnnouncements((prev) => [res.data, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch {
      alert("Failed to add announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`, { withCredentials: true });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete announcement.");
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Welcome back to the FIS management system</p>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>{user?.fullName?.charAt(0).toUpperCase()}</div>
            <div>
              <p style={styles.adminName}>{user?.fullName}</p>
              <p style={styles.role}>{user?.role}</p>
            </div>
          </div>
        </header>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Students</p>
            <h2 style={styles.cardNumber}>{stats ? stats.totalStudents : "—"}</h2>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Active Courses</p>
            <h2 style={styles.cardNumber}>{stats ? stats.totalCourses : "—"}</h2>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Available Rooms</p>
            <h2 style={styles.cardNumber}>{stats ? stats.availableRooms : "—"}</h2>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Enrollments</p>
            <h2 style={styles.cardNumber}>{stats ? stats.totalEnrollments : "—"}</h2>
          </div>
        </section>

        <section style={styles.announcementsSection}>
          <div style={styles.announcementsHeader}>
            <h2 style={styles.panelTitle}>Recent Announcements</h2>
            {isAdmin && (
              <button style={styles.addButton} onClick={() => setShowForm((v) => !v)}>
                {showForm ? "Cancel" : "+ Add Announcement"}
              </button>
            )}
          </div>

          {isAdmin && showForm && (
            <form style={styles.form} onSubmit={handleAdd}>
              <input
                style={styles.input}
                type="text"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                style={styles.textarea}
                placeholder="Announcement description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
              <button style={styles.submitButton} type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post Announcement"}
              </button>
            </form>
          )}

          {loading && <p style={{ color: "#64748b" }}>Loading announcements...</p>}
          {error && <p style={{ color: "#ef4444" }}>{error}</p>}

          {!loading && !error && announcements.length === 0 && (
            <p style={{ color: "#94a3b8" }}>No announcements yet.</p>
          )}

          {!loading && !error && announcements.map((a, idx) => (
            <div key={a._id} style={{ ...styles.announcementCard, background: idx % 2 === 0 ? "#f8fafc" : "#eef6ff" }}>
              <div style={styles.announcementContent}>
                <div style={styles.announcementMeta}>
                  <span style={styles.announcementTitle}>{a.title}</span>
                  <span style={styles.announcementDate}>
                    {new Date(a.postDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p style={styles.announcementDescription}>{a.description}</p>
              </div>
              {isAdmin && (
                <button style={styles.deleteButton} onClick={() => handleDelete(a._id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
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

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    padding: "12px 18px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },

  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  adminName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },

  role: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "22px",
    marginBottom: "30px",
  },

  card: {
    background: "#ffffff",
    padding: "26px",
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

  announcementsSection: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },

  announcementsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  panelTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "22px",
  },

  addButton: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },

  submitButton: {
    alignSelf: "flex-end",
    padding: "10px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  announcementCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "18px 20px",
    borderRadius: "12px",
    marginBottom: "10px",
    gap: "16px",
    border: "1px solid #e2e8f0",

  },

  announcementContent: {
    flex: 1,
  },

  announcementMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    marginBottom: "10px",
  },

  announcementTitle: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "24px",
    textAlign: "left",
  },

  announcementDate: {
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "left",
  },

  announcementDescription: {
    margin: 0,
    color: "#475569",
    lineHeight: "1.6",
    textAlign: "left",
  },

  deleteButton: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

export default Dashboard;