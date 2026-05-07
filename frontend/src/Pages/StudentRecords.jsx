import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import { useAuthContext } from "../hooks/useAuthContext";

function StudentRecords() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/students", { withCredentials: true })
      .then((res) => setStudents(res.data))
      .catch(() => setError("Failed to load students."))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      student.name?.toLowerCase().includes(searchValue) ||
      student.email?.toLowerCase().includes(searchValue) ||
      student.department?.toLowerCase().includes(searchValue) ||
      student.program?.toLowerCase().includes(searchValue) ||
      String(student.studentId || "").includes(search);

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const activeStudents = students.filter((s) => s.status === "active").length;
  const graduatedStudents = students.filter((s) => s.status === "graduated").length;
  const inactiveStudents = students.filter((s) => s.status === "inactive").length;

  const getStatusStyle = (status) => {
    if (status === "active") return styles.activeStatus;
    if (status === "graduated") return styles.graduatedStatus;
    return styles.inactiveStatus;
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>View All Students</h1>
            <p style={styles.subtitle}>
              View and manage student profiles
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              style={styles.addButton}
              onClick={() => navigate("/create-student")}
            >
              + Add Student
            </button>
          )}
        </header>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Students</p>
            <h2 style={styles.cardNumber}>{students.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Active</p>
            <h2 style={styles.cardNumber}>{activeStudents}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Graduated</p>
            <h2 style={styles.cardNumber}>{graduatedStudents}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Inactive</p>
            <h2 style={styles.cardNumber}>{inactiveStudents}</h2>
          </div>
        </section>

        <section style={styles.toolbar}>
          <input
            style={styles.search}
            type="text"
            placeholder="Search by name, email, ID, department, or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            style={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>

          <button
            style={styles.resetButton}
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Reset
          </button>
        </section>

        <section style={styles.tableCard}>
          {loading ? (
            <p style={styles.emptyText}>Loading students...</p>
          ) : error ? (
            <p style={styles.errorText}>{error}</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Program</th>
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Status</th>
                  {user?.role === "admin" && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={user?.role === "admin" ? 8 : 7}
                      style={styles.emptyCell}
                    >
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td style={styles.td}>{student.studentId || student._id}</td>

                      <td style={styles.td}>
                        <div style={styles.studentCell}>
                          <span style={styles.studentName}>
                            {student.name || "Unnamed Student"}
                          </span>
                        </div>
                      </td>

                      <td style={styles.td}>{student.email || "N/A"}</td>
                      <td style={styles.td}>{student.department || "N/A"}</td>
                      <td style={styles.td}>{student.program || "N/A"}</td>
                      <td style={styles.td}>Year {student.yearLevel || "N/A"}</td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            ...getStatusStyle(student.status),
                          }}
                        >
                          {student.status
                            ? student.status.charAt(0).toUpperCase() +
                            student.status.slice(1)
                            : "N/A"}
                        </span>
                      </td>

                      {user?.role === "admin" && (
                        <td style={styles.td}>
                          <button
                            style={styles.editButton}
                            onClick={() => navigate(`/edit-student/${student._id}`)}
                          >
                            Edit
                          </button>
                        </td>
                      )}
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

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
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

  toolbar: {
    display: "flex",
    gap: "16px",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "18px",
    marginBottom: "24px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },

  search: {
    flex: 1,
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  select: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  resetButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#e2e8f0",
    cursor: "pointer",
    fontWeight: "600",
    color: "#334155",
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
    color: "#334155",
  },

  studentCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  studentName: {
    fontWeight: "700",
    color: "#0f172a",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
    display: "inline-block",
  },

  activeStatus: {
    background: "#dcfce7",
    color: "#166534",
  },

  graduatedStatus: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  inactiveStatus: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  editButton: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyText: {
    textAlign: "center",
    color: "#64748b",
  },

  errorText: {
    textAlign: "center",
    color: "#ef4444",
  },

  emptyCell: {
    padding: "28px",
    textAlign: "center",
    color: "#94a3b8",
  },
};

export default StudentRecords;