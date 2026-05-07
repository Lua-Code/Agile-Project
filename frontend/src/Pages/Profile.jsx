import { useAuthContext } from "../hooks/useAuthContext";

function Profile() {
  const { user } = useAuthContext();

  if (!user) {
    return <p style={{ padding: "36px" }}>Loading profile...</p>;
  }

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>My Profile</h1>
            <p style={styles.subtitle}>View your account information</p>
          </div>
        </section>

        <section style={styles.profileCard}>
          <div style={styles.avatar}>
            {user.fullName?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2 style={styles.name}>{user.fullName}</h2>
            <p style={styles.role}>{user.role}</p>
          </div>
        </section>

        <section style={styles.infoCard}>
          <h2 style={styles.sectionTitle}>Account Details</h2>

          <div style={styles.grid}>
            <div style={styles.field}>
              <p style={styles.label}>Full Name</p>
              <p style={styles.value}>{user.fullName || "N/A"}</p>
            </div>

            <div style={styles.field}>
              <p style={styles.label}>Email</p>
              <p style={styles.value}>{user.email || "N/A"}</p>
            </div>

            <div style={styles.field}>
              <p style={styles.label}>Role</p>
              <p style={styles.value}>{user.role || "N/A"}</p>
            </div>

            <div style={styles.field}>
              <p style={styles.label}>User ID</p>
              <p style={styles.value}>{user.id || "N/A"}</p>
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
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "30px",
  },
  name: {
    margin: 0,
    fontSize: "26px",
    color: "#0f172a",
  },
  role: {
    margin: "6px 0 0",
    color: "#64748b",
    textTransform: "capitalize",
  },
  infoCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    margin: "0 0 22px",
    fontSize: "22px",
    color: "#0f172a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px",
  },
  field: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "18px",
  },
  label: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "700",
  },
  value: {
    margin: "8px 0 0",
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "600",
    wordBreak: "break-word",
  },
};

export default Profile;