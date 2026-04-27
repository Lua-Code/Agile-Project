import { useState } from "react";
import { Link } from "react-router-dom";

function Transcripts() {
  const [search, setSearch] = useState("");

  const transcripts = [
    {
      id: "TR-001",
      studentId: "2023001",
      name: "Ahmed Youssef",
      program: "Computer Engineering",
      gpa: "3.72",
      credits: 96,
      status: "Ready",
      updated: "Apr 2026",
    },
    {
      id: "TR-002",
      studentId: "2023002",
      name: "Sara Mohamed",
      program: "Information Systems",
      gpa: "3.89",
      credits: 84,
      status: "Ready",
      updated: "Apr 2026",
    },
    {
      id: "TR-003",
      studentId: "2023003",
      name: "Omar Ali",
      program: "Cybersecurity",
      gpa: "2.94",
      credits: 112,
      status: "Pending",
      updated: "Mar 2026",
    },
  ];

  const filteredTranscripts = transcripts.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.studentId.includes(search) ||
      item.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>FIS</h2>

        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/students" style={styles.link}>Students</Link>
          <span style={styles.link}>Courses</span>
          <span style={styles.link}>Rooms</span>
          <span style={styles.link}>Enrollments</span>
          <span style={styles.activeLink}>Transcripts</span>
          <span style={styles.link}>Reports</span>
        </nav>

        <button style={styles.logout}>Logout</button>
      </aside>

      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Transcripts</h1>
            <p style={styles.subtitle}>
              View, manage, and generate student academic transcripts
            </p>
          </div>

          <button style={styles.primaryButton}>+ Generate Transcript</button>
        </section>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Transcripts</p>
            <h2 style={styles.cardNumber}>312</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Ready</p>
            <h2 style={styles.cardNumber}>284</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Pending</p>
            <h2 style={styles.cardNumber}>28</h2>
          </div>
        </section>

        <section style={styles.toolbar}>
          <input
            style={styles.search}
            type="text"
            placeholder="Search by student name, ID, or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Transcript ID</th>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Program</th>
                <th style={styles.th}>GPA</th>
                <th style={styles.th}>Credits</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Last Updated</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTranscripts.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.studentId}</td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.program}</td>
                  <td style={styles.td}>{item.gpa}</td>
                  <td style={styles.td}>{item.credits}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          item.status === "Ready" ? "#dcfce7" : "#fef3c7",
                        color: item.status === "Ready" ? "#15803d" : "#b45309",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={styles.td}>{item.updated}</td>
                  <td style={styles.td}>
                    <button style={styles.viewButton}>View</button>
                    <button style={styles.downloadButton}>Download</button>
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
  primaryButton: {
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
  viewButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "8px",
  },
  downloadButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#e0f2fe",
    color: "#0369a1",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Transcripts;