import { useState } from "react";

function StudentRecords() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ahmed Youssef",
      email: "ahmed@fis.com",
      course: "Computer engineering",
      year: "Year 3",
      status: "Active",
    },
    {
      id: 2,
      name: "Sara Mohamed",
      email: "sara@fis.com",
      course: "Information Systems",
      year: "Year 2",
      status: "Active",
    },
    {
      id: 3,
      name: "Omar Ali",
      email: "omar@fis.com",
      course: "Cybersecurity",
      year: "Year 4",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Student Records</h1>
            <p style={styles.subtitle}>Manage and view all student information</p>
          </div>

          <button style={styles.addButton}>+ Add Student</button>
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
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Year</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td style={styles.td}>{student.id}</td>
                  <td style={styles.td}>{student.name}</td>
                  <td style={styles.td}>{student.email}</td>
                  <td style={styles.td}>{student.course}</td>
                  <td style={styles.td}>{student.year}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          student.status === "Active" ? "#dcfce7" : "#fee2e2",
                        color:
                          student.status === "Active" ? "#166534" : "#991b1b",
                      }}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editButton}>Edit</button>
                    <button style={styles.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    textAlign: "left",
    padding: "16px",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "15px",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
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