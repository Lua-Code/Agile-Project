import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";

function AdmissionApplication() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    program: "",
    department: "",
    previousSchool: "",
    graduationYear: "",
    gpa: "",
    personalStatement: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.program ||
      !formData.department
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const { data } = await api.post("/admissions", formData);

      alert(data.message || "Application submitted successfully");
      navigate("/login");
    } catch (err) {
      console.error("Application submit failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit application");
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Admission Application</h1>
            <p style={styles.subtitle}>
              Submit your application to join the university
            </p>
          </div>
        </section>

        <section style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Applicant Information</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="example@email.com"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Phone *</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Program *</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select program</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Systems">Information Systems</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Department *</label>
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Computer Engineering"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Previous School</label>
                <input
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Your previous school"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="2026"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>GPA / Score</label>
                <input
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="3.7 or 95%"
                />
              </div>

              <div style={styles.fieldWide}>
                <label style={styles.label}>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your address"
                />
              </div>

              <div style={styles.fieldFull}>
                <label style={styles.label}>Personal Statement</label>
                <textarea
                  name="personalStatement"
                  value={formData.personalStatement}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Tell us briefly why you want to apply..."
                />
              </div>
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>

              <button type="submit" style={styles.primaryButton}>
                Submit Application
              </button>
            </div>
          </form>
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
  formCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "22px",
    color: "#0f172a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fieldWide: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    gridColumn: "span 2",
  },
  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    gridColumn: "span 3",
  },
  label: {
    color: "#475569",
    fontWeight: "700",
    fontSize: "14px",
  },
  input: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "120px",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
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
  cancelButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "#e2e8f0",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default AdmissionApplication;