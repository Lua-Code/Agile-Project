import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import { useAuthContext } from "../hooks/useAuthContext";

function StudentRecords() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data))
      .catch(() => setError("Failed to load students."))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(s.studentId).includes(search)
  );

  const handleAddStudent = () => {
    if (!user || user.role !== "admin") return;
    navigate("/create-student");
  };

  return (
    <div style={styles.page}>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Student Records</h1>
            <p style={styles.subtitle}>Manage and view all student information</p>
          </div>

          {user?.role === "admin" && (
            <button style={styles.addButton} onClick={handleAddStudent}>
              + Add Student
            </button>
          )}
        </header>

        <section style={styles.toolbar}>
          <input
            style={styles.search}
            type="text"
            placeholder="Search student by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section style={styles.tableCard}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Program</th>
                  <th style={styles.th}>Year Level</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...styles.td, color: "#94a3b8" }}>
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td style={styles.td}>{student.studentId}</td>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.email}</td>
                      <td style={styles.td}>{student.department}</td>
                      <td style={styles.td}>{student.program}</td>
                      <td style={styles.td}>Year {student.yearLevel}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            background:
                              student.status === "active"
                                ? "#dcfce7"
                                : student.status === "graduated"
                                ? "#dbeafe"
                                : "#fee2e2",
                            color:
                              student.status === "active"
                                ? "#166534"
                                : student.status === "graduated"
                                ? "#1d4ed8"
                                : "#991b1b",
                          }}
                        >
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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

  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    color: "#ffffff",
    padding: "30px 24px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "34px",
    margin: "0 0 45px",
    color: "#38bdf8",
    letterSpacing: "2px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    flex: 1,
  },

  activeLink: {
    padding: "14px 16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  link: {
    padding: "14px 16px",
    borderRadius: "12px",
    color: "#cbd5e1",
    cursor: "pointer",
    textDecoration: "none",
  },

  logout: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "36px",
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

  addButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  toolbar: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "18px",
    marginBottom: "24px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },

  search: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
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
  },

  editButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "8px",
  },

  deleteButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default StudentRecords;