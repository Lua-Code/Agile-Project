import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import { useAuthContext } from "../hooks/useAuthContext";

export default function CreateCourse() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    description: "",
    type: "core",
    creditHours: "",
    department: "",
    professorId: "",
    status: "active",
    prerequisites: "",
  });
  const [professorSearch, setProfessorSearch] = useState("");
  const [professorOptions, setProfessorOptions] = useState([]);
  const [showProfDropdown, setShowProfDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (professorSearch.length < 2) return;
    let cancelled = false;
    api
      .get(`/professors?search=${encodeURIComponent(professorSearch)}`)
      .then((res) => {
        if (!cancelled) setProfessorOptions(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [professorSearch]);

  if (!user || user.role !== "admin") {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <p style={{ color: "#ef4444", fontSize: "18px" }}>
            Access denied. Only admins can create courses.
          </p>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "courseCode") {
      setFormData((prev) => ({ ...prev, courseCode: value.toUpperCase() }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessorSelect = (prof) => {
    setProfessorSearch(prof.name);
    setFormData((prev) => ({ ...prev, professorId: prof._id }));
    setShowProfDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credits = Number(formData.creditHours);
    if (credits < 0 || credits > 5) {
      setError("Credit hours must be between 0 and 5.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...formData,
        creditHours: credits,
        prerequisites: formData.prerequisites
          ? formData.prerequisites.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await api.post("/courses", payload);
      navigate("/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Create New Course</h1>
            <p style={styles.subtitle}>Fill in the course details below</p>
          </div>
        </header>

        <section style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Course Code <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., CS101"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Course Title <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Introduction to Computer Science"
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  style={styles.textarea}
                  placeholder="Enter course description..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Course Type <span style={styles.required}>*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="core">Core</option>
                  <option value="elective">Elective</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Credit Hours (0–5) <span style={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="creditHours"
                  value={formData.creditHours}
                  onChange={handleChange}
                  required
                  min="0"
                  max="5"
                  step="1"
                  style={styles.input}
                  placeholder="e.g., 3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Department <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div style={{ ...styles.formGroup, position: "relative" }}>
                <label style={styles.label}>Professor</label>
                <input
                  type="text"
                  value={professorSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfessorSearch(val);
                    setFormData((prev) => ({ ...prev, professorId: "" }));
                    if (val.length < 2) setProfessorOptions([]);
                    setShowProfDropdown(true);
                  }}
                  onFocus={() =>
                    professorOptions.length > 0 && setShowProfDropdown(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowProfDropdown(false), 150)
                  }
                  style={styles.input}
                  placeholder="Search professor by name..."
                  autoComplete="off"
                />
                {showProfDropdown && professorOptions.length > 0 && (
                  <div style={styles.dropdown}>
                    {professorOptions.map((prof) => (
                      <div
                        key={prof._id}
                        style={styles.dropdownItem}
                        onMouseDown={() => handleProfessorSelect(prof)}
                      >
                        {prof.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Prerequisites</label>
                <input
                  type="text"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter prerequisite course IDs (comma-separated)"
                />
                <p style={styles.helpText}>
                  Enter course IDs separated by commas
                </p>
              </div>
            </div>

            {error && (
              <p style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</p>
            )}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    height: "100%",
  },

  main: {
    flex: 1,
    padding: "36px",
    overflowY: "auto",
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

  formCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "32px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
  },

  formGroupFull: {
    display: "flex",
    flexDirection: "column",
    gridColumn: "1 / -1",
  },

  label: {
    marginBottom: "8px",
    color: "#475569",
    fontSize: "15px",
    fontWeight: "600",
  },

  required: {
    color: "#ef4444",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
  },

  select: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  helpText: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#64748b",
  },

  fieldError: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#ef4444",
  },

  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
    zIndex: 100,
    maxHeight: "200px",
    overflowY: "auto",
    marginTop: "4px",
  },

  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#0f172a",
    borderBottom: "1px solid #f1f5f9",
  },

  submitButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
};
