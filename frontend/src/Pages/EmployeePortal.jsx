import { useState, useEffect } from "react";
import api from "../Api/axios";

export default function EmployeePortal() {
  const [activeTab, setActiveTab] = useState("payroll");
  const [hrData, setHrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: "vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    api
      .get("/hr/me", { withCredentials: true })
      .then((res) => setHrData(res.data))
      .catch(() => setError("Failed to load employee data."))
      .finally(() => setLoading(false));
  }, []);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/hr/leave", leaveForm, { withCredentials: true });
      setHrData((prev) => ({
        ...prev,
        leaveRequests: [...(prev.leaveRequests || []), res.data],
      }));
      setLeaveForm({ type: "vacation", startDate: "", endDate: "", reason: "" });
    } catch {
      alert("Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.page}><main style={styles.main}><p>Loading...</p></main></div>;
  if (error) return <div style={styles.page}><main style={styles.main}><p style={{ color: "#ef4444" }}>{error}</p></main></div>;

  const employee = {
    name: hrData?.userId?.fullName || "—",
  };

  const baseSalary = hrData?.baseSalary || 0;
  const leaveBalance = hrData?.leaveBalance || { vacation: 0, sick: 0, personal: 0 };
  const benefits = hrData?.benefits || [];
  const payHistory = hrData?.payHistory || [];
  const leaveRequests = hrData?.leaveRequests || [];

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Employee Portal</h1>
            <p style={styles.subtitle}>Manage your payroll, leave, and benefits</p>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>{employee.name.charAt(0).toUpperCase()}</div>
            <div>
              <p style={styles.employeeName}>{employee.name}</p>
            </div>
          </div>
        </header>

        <section style={styles.tabs}>
          <button
            style={activeTab === "payroll" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("payroll")}
          >
            Payroll
          </button>
          <button
            style={activeTab === "leave" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("leave")}
          >
            Leave Management
          </button>
          <button
            style={activeTab === "benefits" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("benefits")}
          >
            Benefits
          </button>
        </section>

        {activeTab === "payroll" && (
          <>
            <section style={styles.singleCard}>
              <div style={{ ...styles.card, background: "linear-gradient(135deg, #2563eb, #38bdf8)", color: "#ffffff" }}>
                <p style={{ ...styles.cardLabel, color: "#e0f2fe" }}>Base Salary</p>
                <h2 style={{ ...styles.cardNumber, color: "#ffffff" }}>${baseSalary.toLocaleString()}</h2>
              </div>
            </section>

            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Salary History</h2>

              {payHistory.length === 0 && (
                <p style={{ color: "#94a3b8" }}>No pay history available.</p>
              )}

              {payHistory.map((pay, index) => (
                <div key={index} style={styles.historyItem}>
                  <div>
                    <p style={styles.historyMonth}>{pay.month}</p>
                    <p style={styles.historyDate}>
                      {pay.date ? new Date(pay.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={styles.historyAmount}>${pay.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "leave" && (
          <>
            <section style={styles.contentGrid}>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Request Leave</h2>

              <form onSubmit={handleLeaveSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    style={styles.select}
                  >
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Date</label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>End Date</label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Reason</label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    required
                    rows={4}
                    style={styles.textarea}
                    placeholder="Please provide a reason for your leave request..."
                  />
                </div>

                <button type="submit" style={styles.submitButton} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Leave Request"}
                </button>
              </form>
            </div>

            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Leave Request History</h2>

              {leaveRequests.length === 0 && (
                <p style={{ color: "#94a3b8" }}>No leave requests yet.</p>
              )}

              {leaveRequests.map((request, idx) => (
                <div key={request._id || idx} style={styles.leaveItem}>
                  <div>
                    <p style={styles.leaveType}>
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                    </p>
                    <p style={styles.leaveDate}>
                      {new Date(request.startDate).toLocaleDateString()} – {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    background: request.status === "approved" ? "#10b981" :
                               request.status === "pending" ? "#f59e0b" : "#ef4444",
                  }}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </section>
          </>
        )}

        {activeTab === "benefits" && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Your Benefits</h2>

            {benefits.length === 0 && (
              <p style={{ color: "#94a3b8" }}>No benefits on record.</p>
            )}

            {benefits.map((benefit, index) => (
              <div key={index} style={styles.benefitItem}>
                <div>
                  <p style={styles.benefitName}>{benefit.name}</p>
                  <p style={styles.benefitCoverage}>{benefit.coverage}</p>
                </div>
                <span style={{ ...styles.statusBadge, background: "#10b981" }}>Active</span>
              </div>
            ))}
          </div>
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
    overflowY: "auto",
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

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    padding: "12px 18px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },

  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  employeeName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },

  role: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  infoCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },

  infoCard: {
    background: "#ffffff",
    padding: "20px 24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  },

  infoLabel: {
    margin: "0 0 6px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
  },

  infoValue: {
    margin: 0,
    color: "#0f172a",
    fontWeight: "700",
    fontSize: "16px",
  },

  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "28px",
  },

  tab: {
    padding: "14px 24px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  activeTab: {
    padding: "14px 24px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
  },

  singleCard: {
    maxWidth: "400px",
    marginBottom: "30px",
  },

  card: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },

  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontWeight: "600",
    fontSize: "14px",
  },

  cardNumber: {
    margin: "12px 0 0",
    fontSize: "34px",
    color: "#0f172a",
  },

  leaveBalanceCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },

  balanceCard: {
    background: "#ffffff",
    padding: "20px 24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
    textAlign: "center",
  },

  balanceNumber: {
    margin: "8px 0 0",
    fontSize: "32px",
    color: "#2563eb",
    fontWeight: "800",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },

  panel: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    marginBottom: "24px",
  },

  panelTitle: {
    margin: "0 0 22px",
    color: "#0f172a",
    fontSize: "22px",
  },

  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  historyMonth: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },

  historyDate: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  historyAmount: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "18px",
  },

  benefitItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  benefitName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "16px",
  },

  benefitCoverage: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  formGroup: {
    marginBottom: "20px",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#475569",
    fontSize: "15px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
    boxSizing: "border-box",
  },

  submitButton: {
    width: "100%",
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
  },

  leaveItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  leaveType: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },

  leaveDate: {
    margin: "4px 0",
    fontSize: "14px",
    color: "#64748b",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
  },
};
