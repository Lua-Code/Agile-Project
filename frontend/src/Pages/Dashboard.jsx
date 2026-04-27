import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function Dashboard() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  return (
    <div style={styles.page}>
      
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Welcome back to the FIS management system</p>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>{user?.fullName?.charAt(0).toUpperCase()}</div>
            <div>
              <p style={styles.adminName}>{user?.fullName}</p>
              <p style={styles.role}>{user?.role}</p>
            </div>
          </div>
        </header>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Students</p>
            <h2 style={styles.cardNumber}>1,248</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Active Courses</p>
            <h2 style={styles.cardNumber}>36</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Available Rooms</p>
            <h2 style={styles.cardNumber}>18</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Enrollments</p>
            <h2 style={styles.cardNumber}>842</h2>
          </div>
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Recent Activity</h2>

            <div style={styles.activity}>
              <span style={styles.dot}></span>
              <p>New student registration completed</p>
            </div>

            <div style={styles.activity}>
              <span style={styles.dot}></span>
              <p>Course schedule updated</p>
            </div>

            <div style={styles.activity}>
              <span style={styles.dot}></span>
              <p>Room assignment changed</p>
            </div>

            <div style={styles.activity}>
              <span style={styles.dot}></span>
              <p>New enrollment request received</p>
            </div>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>System Overview</h2>

            <div style={styles.progressItem}>
              <p>Student Capacity</p>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: "78%" }}></div>
              </div>
            </div>

            <div style={styles.progressItem}>
              <p>Course Usage</p>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: "64%" }}></div>
              </div>
            </div>

            <div style={styles.progressItem}>
              <p>Room Availability</p>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: "52%" }}></div>
              </div>
            </div>
          </div>
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
    marginBottom: "32px",
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

  adminName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },

  role: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "22px",
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
  },

  cardNumber: {
    margin: "12px 0 0",
    fontSize: "34px",
    color: "#0f172a",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "24px",
  },

  panel: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },

  panelTitle: {
    margin: "0 0 22px",
    color: "#0f172a",
    fontSize: "22px",
  },

  activity: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#38bdf8",
  },

  progressItem: {
    marginBottom: "24px",
    color: "#334155",
    fontWeight: "600",
  },

  progressBar: {
    height: "10px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
  },
};

export default Dashboard;