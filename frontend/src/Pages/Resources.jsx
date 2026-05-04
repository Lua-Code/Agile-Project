import { useEffect, useState } from "react";
import api from "../Api/axios";

function Resources() {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "equipment",
    department: "",
    quantity: 1,
    availableQuantity: 1,
    condition: "good",
    status: "available",
    notes: "",
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get("/resources", {
          withCredentials: true,
        });

        setResources(data.resources || []);
      } catch (err) {
        console.error("Failed to fetch resources:", err.response?.data || err.message);
      }
    };

    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "availableQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.department || formData.quantity < 1) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const { data } = await api.post("/resources", formData, {
        withCredentials: true,
      });

      setResources((prev) => [data.resource, ...prev]);

      setFormData({
        name: "",
        category: "equipment",
        department: "",
        quantity: 1,
        availableQuantity: 1,
        condition: "good",
        status: "available",
        notes: "",
      });

      alert(data.message || "Resource assigned successfully");
    } catch (err) {
      console.error("Failed to assign resource:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to assign resource");
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Resource Allocation</h1>
            <p style={styles.subtitle}>
              Assign and track university equipment across departments
            </p>
          </div>
        </section>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Resources</p>
            <h2 style={styles.cardNumber}>{resources.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Assigned</p>
            <h2 style={styles.cardNumber}>
              {resources.filter((r) => r.status === "assigned").length}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Maintenance</p>
            <h2 style={styles.cardNumber}>
              {resources.filter((r) => r.status === "maintenance").length}
            </h2>
          </div>
        </section>

        <section style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Assign Equipment</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Resource Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Oscilloscope, Projector, Laptop..."
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="equipment">Equipment</option>
                  <option value="lab-tool">Lab Tool</option>
                  <option value="furniture">Furniture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Department</label>
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Engineering"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Available Quantity</label>
                <input
                  type="number"
                  min="0"
                  name="availableQuantity"
                  value={formData.availableQuantity}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="needs-maintenance">Needs Maintenance</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div style={styles.fieldWide}>
                <label style={styles.label}>Notes</label>
                <input
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes..."
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" style={styles.primaryButton}>
              Assign Resource
            </button>
          </form>
        </section>

        <section style={styles.tableCard}>
          <h2 style={styles.sectionTitle}>Allocated Resources</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Condition</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr key={resource._id}>
                  <td style={styles.td}>{resource.name}</td>
                  <td style={styles.td}>{resource.category}</td>
                  <td style={styles.td}>{resource.department}</td>
                  <td style={styles.td}>{resource.quantity}</td>
                  <td style={styles.td}>{resource.availableQuantity}</td>
                  <td style={styles.td}>{resource.condition}</td>
                  <td style={styles.td}>
                    <span style={styles.status}>{resource.status}</span>
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
  formCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    marginBottom: "24px",
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
  primaryButton: {
    alignSelf: "flex-end",
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
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
    background: "#dbeafe",
    color: "#1d4ed8",
  },
};

export default Resources;