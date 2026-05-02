import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";

function CourseCatalog() {
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [requestedCourseIds, setRequestedCourseIds] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await api.delete(`/courses/${courseId}`, {
        withCredentials: true,
      });

      setCourses((prev) =>
        prev.filter((c) => c.id !== courseId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete");
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await api.post(
        `/enrollments/request/${courseId}`,
        {},
        { withCredentials: true }
      );

      setRequestedCourseIds((prev) => [...prev, courseId]);

      alert(res.data.message || "Enrollment request submitted");
    } catch (err) {
      console.error("Enroll failed:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Failed to request enrollment");
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await api.get("/auth/me", {
          withCredentials: true,
        });

        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const coursesFetched = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/courses", {
          withCredentials: true,
        });

        const mappedCourses = data.map((c) => ({
          id: c._id,
          code: c.courseCode,
          name: c.title,
          type: c.type === "core" ? "Core" : "Elective",
          professor: c.professorId?.userId?.fullName || "N/A",
          prerequisites:
            c.prerequisites?.length > 0
              ? c.prerequisites.map((p) => p.courseCode).join(", ")
              : "None",
        }));

        setCourses(mappedCourses);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    coursesFetched();
  }, []);

  const role = currentUser?.role;

  const isAdmin = role === "admin";
  const isStudent = role === "student";
  const isProfessorOrTa = role === "professor" || role === "ta";

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!isStudent) return;

      try {
        const { data } = await api.get("/enrollments/requests/my-requests", {
          withCredentials: true,
        });

        const ids = data.map((request) => request.courseId);

        setRequestedCourseIds(ids);
      } catch (err) {
        console.error("Failed to fetch enrollment requests:", err.response?.data || err.message);
      }
    };

    fetchMyRequests();
  }, [isStudent]);


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

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Course Catalog</h1>
            <p style={styles.subtitle}>
              Browse and manage all available courses
            </p>
          </div>

          {isAdmin && (
            <button
              style={styles.addButton}
              onClick={() => navigate("/create-courses")}
            >
              + Add Course
            </button>
          )}
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

        {loading && <p>Loading courses...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <section style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Course Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Professor</th>
                  <th style={styles.th}>Prerequisites</th>
                  {!isProfessorOrTa && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => {
                  const isRequested = requestedCourseIds.includes(course.id);

                  return (
                    <tr key={course.id}>
                      <td style={styles.td}>{course.code}</td>
                      <td style={styles.td}>{course.name}</td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            background:
                              course.type === "Core"
                                ? "#dbeafe"
                                : "#fef3c7",
                          }}
                        >
                          {course.type}
                        </span>
                      </td>

                      <td style={styles.td}>{course.professor}</td>
                      <td style={styles.td}>{course.prerequisites}</td>

                      {!isProfessorOrTa && (
                        <td style={styles.td}>

                          {isAdmin && (
                            <>
                              <button
                                style={styles.editButton}
                                onClick={() =>
                                  navigate(`/edit-course/${course.id}`)
                                }
                              >
                                Edit
                              </button>

                              <button
                                style={styles.deleteButton}
                                onClick={() => handleDelete(course.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}

                          {isStudent && (
                            <button
                              style={{
                                ...styles.enrollButton,
                                ...(isRequested
                                  ? styles.disabledEnrollButton
                                  : {}),
                              }}
                              disabled={isRequested}
                              onClick={() => handleEnroll(course.id)}
                            >
                              {isRequested ? "Requested" : "Enroll"}
                            </button>
                          )}

                        </td>
                      )}
                    </tr>
                  );
                })}
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

  enrollButton: {
    padding: "8px 30px",
    borderRadius: "8px",
    border: "none",
    background: "#dbeafe",
    color: "#1d4ed8",
    marginRight: "8px",
    cursor: "pointer",
  },

  disabledEnrollButton: {
    background: "#e2e8f0",
    color: "#64748b",
    cursor: "not-allowed",
  }
};

export default CourseCatalog;