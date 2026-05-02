import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import { useAuthContext } from "../hooks/useAuthContext";

export default function CreateStudent() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    emailPrefix: "",
    password: "",
    department: "",
    program: "",
    yearLevel: "",
    status: "active",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "admin") {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <p style={{ color: "#ef4444", fontSize: "18px" }}>
            Access denied. Only admins can create students.
          </p>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { fullName, emailPrefix, password, department, program, yearLevel } = formData;

    if (!fullName.trim() || !emailPrefix.trim() || !password || !department.trim() || !program.trim() || !yearLevel) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/students", {
        ...formData,
        email: `${emailPrefix.trim()}@fis.com`,
        yearLevel: Number(formData.yearLevel),
      });
      navigate("/students");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Create New Student</h1>
            <p style={styles.subtitle}>Fill in the student details below</p>
          </div>
          <button style={styles.backButton} onClick={() => navigate("/students")}>
            ← Back to Student Records
          </button>
        </header>

        <section style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.sectionsContainer}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Full Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Enter student's full name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Email Address <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.emailRow}>
                    <input
                      type="text"
                      name="emailPrefix"
                      value={formData.emailPrefix}
                      onChange={handleChange}
                      required
                      style={{ ...styles.input, flex: 1, borderRadius: "12px 0 0 12px", borderRight: "none" }}
                      placeholder="e.g., john.doe"
                    />
                    <span style={styles.emailSuffix}>@fis.com</span>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Password <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Academic Information</h2>

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

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Program <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </div>

                <div style={styles.rowGroup}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Year Level <span style={styles.required}>*</span>
                    </label>
                    <select
                      name="yearLevel"
                      value={formData.yearLevel}
                      onChange={handleChange}
                      required
                      style={styles.select}
                    >
                      <option value="">Select year level</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Status <span style={styles.required}>*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      style={styles.select}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Student"}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },

  backButton: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  emailRow: {
    display: "flex",
    alignItems: "stretch",
  },

  emailSuffix: {
    padding: "14px 16px",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "0 12px 12px 0",
    fontSize: "15px",
    color: "#475569",
    whiteSpace: "nowrap",
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

  sectionsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
    marginBottom: "32px",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#0f172a",
    paddingBottom: "12px",
    borderBottom: "2px solid #e2e8f0",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
  },

  rowGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
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

  select: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
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
