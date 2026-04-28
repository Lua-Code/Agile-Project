import { useState } from "react";

function CourseCatalog() {
  const [courses] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Intro to Computer Science",
      type: "Core",
      professor: "Dr. Smith",
      schedule: "Mon/Wed • 10:00–12:00",
    },
    {
      id: 2,
      code: "CS202",
      name: "Data Structures",
      type: "Core",
      professor: "Dr. Ali",
      schedule: "Tue/Thu • 12:00–2:00",
    },
    {
      id: 3,
      code: "CS305",
      name: "AI Fundamentals",
      type: "Elective",
      professor: "Dr. John",
      schedule: "Sun/Tue • 3:00–5:00",
    },
  ]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All" || course.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Course Catalog</h1>
            <p style={styles.subtitle}>
              Browse and manage all available courses
            </p>
          </div>

          <button style={styles.addButton}>+ Add Course</button>
        </header>

        <section style={styles.toolbar}>
          <div style={styles.toolbarRow}>
            
            <input
              style={styles.search}
              type="text"
              placeholder="Search course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              style={styles.select}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
            </select>

            <button
              style={styles.resetButton}
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
              }}
            >
              Reset
            </button>

          </div>
        </section>

        <section style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Course Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Professor</th>
                <th style={styles.th}>Schedule</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td style={styles.td}>{course.code}</td>
                  <td style={styles.td}>{course.name}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          course.type === "Core" ? "#dbeafe" : "#fef3c7",
                        color:
                          course.type === "Core" ? "#1d4ed8" : "#92400e",
                      }}
                    >
                      {course.type}
                    </span>
                  </td>

                  <td style={styles.td}>{course.professor}</td>
                  <td style={styles.td}>{course.schedule}</td>

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

  toolbarRow: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  search: {
    flex: 1,
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
  },

  select: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
  },

  resetButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#e2e8f0",
    cursor: "pointer",
    fontWeight: "600",
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
    marginRight: "8px",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
  },
};

export default CourseCatalog;