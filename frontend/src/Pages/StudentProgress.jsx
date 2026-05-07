import { useEffect, useState } from "react";
import api from "../Api/axios";

function StudentProgress() {
  const [records, setRecords] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/student-records/my-child-progress", {
          withCredentials: true,
        });

        setRecords(data.records || []);
        setStudentInfo(data.student || null);
      } catch (err) {
        console.error("Failed to fetch child progress:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load child progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const allGrades = records.flatMap((record) =>
    (record.grades || []).map((grade) => ({
      recordId: record._id,
      academicYear: record.academicYear,
      semester: record.semester,
      courseCode: grade.courseId?.courseCode || "N/A",
      courseTitle: grade.courseId?.title || "N/A",
      creditHours: grade.creditHours || 0,
      grade: grade.grade || "N/A",
    }))
  );

  const totalCredits = allGrades.reduce(
    (sum, grade) => sum + Number(grade.creditHours || 0),
    0
  );

  const weightedGpaSum = records.reduce((sum, record) => {
    const recordCredits = (record.grades || []).reduce(
      (gradeSum, grade) => gradeSum + Number(grade.creditHours || 0),
      0
    );

    return sum + Number(record.gpa || 0) * recordCredits;
  }, 0);

  const overallGpa =
    totalCredits > 0 ? (weightedGpaSum / totalCredits).toFixed(2) : "—";

  if (loading) {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <p style={styles.emptyText}>Loading child progress...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <p style={styles.errorText}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Child Progress</h1>
            <p style={styles.subtitle}>
              View your child&apos;s academic progress and course performance
            </p>
          </div>
        </section>

        <section style={styles.profileCard}>
          <div style={styles.avatar}>
            {studentInfo?.userId?.fullName?.charAt(0).toUpperCase() || "S"}
          </div>

          <div>
            <h2 style={styles.studentName}>
              {studentInfo?.userId?.fullName || "Student"}
            </h2>
            <p style={styles.studentMeta}>
              Student ID: {studentInfo?.studentId || "N/A"} •{" "}
              {studentInfo?.program || "N/A"} • {studentInfo?.department || "N/A"}
            </p>
          </div>
        </section>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Overall GPA</p>
            <h2 style={styles.cardNumber}>{overallGpa}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Completed Credits</p>
            <h2 style={styles.cardNumber}>{totalCredits}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Courses</p>
            <h2 style={styles.cardNumber}>{allGrades.length}</h2>
          </div>
        </section>

        <section style={styles.tableCard}>
          <h2 style={styles.sectionTitle}>Detailed Course Progress</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Course Code</th>
                <th style={styles.th}>Course Title</th>
                <th style={styles.th}>Credit Hours</th>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>Academic Year</th>
              </tr>
            </thead>

            <tbody>
              {allGrades.length > 0 ? (
                allGrades.map((grade, index) => (
                  <tr key={`${grade.recordId}-${index}`}>
                    <td style={styles.td}>{grade.courseCode}</td>
                    <td style={styles.td}>{grade.courseTitle}</td>
                    <td style={styles.td}>{grade.creditHours}</td>
                    <td style={styles.td}>
                      <span style={styles.status}>{grade.grade}</span>
                    </td>
                    <td style={styles.td}>{grade.semester}</td>
                    <td style={styles.td}>{grade.academicYear}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.emptyCell} colSpan="6">
                    No academic records available.
                  </td>
                </tr>
              )}
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
  profileCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "24px",
  },
  studentName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "24px",
  },
  studentMeta: {
    margin: "6px 0 0",
    color: "#64748b",
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
  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "22px",
    color: "#0f172a",
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
    background: "#dbeafe",
    color: "#1d4ed8",
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

export default StudentProgress;