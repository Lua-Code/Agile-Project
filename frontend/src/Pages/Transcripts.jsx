import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Transcripts() {
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleExportPDF = (item) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Student Transcript", 14, 15);

    doc.setFontSize(11);
    doc.text(`Student Name: ${item.studentName}`, 14, 30);
    doc.text(`Student ID: ${item.studentId}`, 14, 38);
    doc.text(`Program: ${item.program}`, 14, 46);
    doc.text(`GPA: ${item.gpa}`, 14, 54);
    doc.text(`Total Credits: ${item.credits}`, 14, 62);

    const tableRows = item.grades.map((grade) => [
      grade.courseId?.courseCode || "N/A",
      grade.courseId?.title || "N/A",
      grade.creditHours || "N/A",
      grade.grade || "N/A",
      item.semester || "N/A",
      item.academicYear || "N/A",
    ]);

    autoTable(doc, {
      startY: 75,
      head: [[
        "Course Code",
        "Course Title",
        "Credit Hours",
        "Grade",
        "Semester",
        "Academic Year",
      ]],
      body: tableRows,
    });

    doc.save(`${item.studentName}-transcript.pdf`);
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRes = await api.get("/auth/me", {
          withCredentials: true,
        });

        setCurrentUser(userRes.data.user);

        const transcriptsRes = await api.get("/student-records/transcripts", {
          withCredentials: true,
        });

        const mappedTranscripts = (transcriptsRes.data.transcripts || []).map((record) => ({
          id: record._id,
          studentId: record.studentId?.studentId || "N/A",
          studentName: record.studentId?.userId?.fullName || "N/A",
          program: record.studentId?.program || "N/A",
          academicYear: record.academicYear || "N/A",
          semester: record.semester || "N/A",
          courses: record.grades?.length || 0,
          credits:
            record.grades?.reduce((sum, grade) => sum + (grade.creditHours || 0), 0) || 0,
          gpa: record.gpa ?? "N/A",
          status: record.status || "N/A",

          grades: record.grades || [],
        }));

        setTranscripts(mappedTranscripts);
      } catch (err) {
        console.error("Failed to fetch transcripts:", err.response?.data || err.message);
        setError("Failed to fetch transcripts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const role = currentUser?.role;
  const isAdmin = role === "admin";
  const isStudent = role === "student";

  const filteredTranscripts = transcripts.filter((item) => {
    const searchValue = search.toLowerCase();

    return (
      item.studentName?.toLowerCase().includes(searchValue) ||
      item.studentId?.toString().includes(search) ||
      item.program?.toLowerCase().includes(searchValue) ||
      item.semester?.toLowerCase().includes(searchValue) ||
      item.academicYear?.includes(search)
    );
  });

  const completedCount = transcripts.filter(
    (r) => r.status === "Completed"
  ).length;

  const inProgressCount = transcripts.filter(
    (r) => r.status === "In Progress"
  ).length;

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Transcripts</h1>
            <p style={styles.subtitle}>View student academic records</p>
          </div>
        </section>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Transcripts</p>
            <h2 style={styles.cardNumber}>{transcripts.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Completed</p>
            <h2 style={styles.cardNumber}>{completedCount}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>In Progress</p>
            <h2 style={styles.cardNumber}>{inProgressCount}</h2>
          </div>
        </section>

        <section style={styles.toolbar}>
          <input
            style={styles.search}
            type="text"
            placeholder="Search by student, ID, program, semester, or academic year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {loading && <p>Loading transcripts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <section style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Program</th>
                  <th style={styles.th}>Courses Completed</th>
                  <th style={styles.th}>Credits</th>
                  <th style={styles.th}>GPA</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTranscripts.map((item) => (
                  <tr key={item.id || item._id}>
                    <td style={styles.td}>{item.studentId}</td>
                    <td style={styles.td}>{item.studentName}</td>
                    <td style={styles.td}>{item.program}</td>
                    <td style={styles.td}>{item.courses}</td>
                    <td style={styles.td}>{item.credits}</td>
                    <td style={styles.td}>{item.gpa}</td>
                    <td style={styles.td}>
                      <button style={styles.downloadButton} onClick={() => handleExportPDF(item)}>
                        Export
                      </button>
                    </td>
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
  viewButton: {
    padding: "4px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "8px",
  },
  downloadButton: {
    padding: "4px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#e0f2fe",
    color: "#0369a1",
    fontWeight: "700",
    cursor: "pointer",
    margin: "4px",
  },
};

export default Transcripts;