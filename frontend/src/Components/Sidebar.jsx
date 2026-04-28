import { NavLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Sidebar({ isOpen }) {
    const { logout } = useLogout();

    return (
        <aside
            style={{
                ...styles.sidebar,
                width: isOpen ? "260px" : "0px",
                padding: isOpen ? "30px 24px" : "30px 0",
                overflow: "hidden",
                transition: "width 0.3s ease, padding 0.3s ease",
            }}
        >
            <div style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.2s ease" }}>
                <h2 style={styles.logo}>Welcome!</h2>

                <nav style={styles.nav}>
                    <NavLink to="/dashboard" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/students" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Student Records
                    </NavLink>

                    <NavLink to="/courses" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Courses
                    </NavLink>

                    <NavLink to="/rooms" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Rooms
                    </NavLink>

                    <NavLink to="/enrollments" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Enrollments
                    </NavLink>

                    <NavLink to="/transcripts" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Transcripts
                    </NavLink>
                </nav>

            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        background: "linear-gradient(180deg, #1d3557, #1e293b)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
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
        textDecoration: "none",
    },

    link: {
        padding: "14px 16px",
        borderRadius: "12px",
        color: "#cbd5e1",
        cursor: "pointer",
        textDecoration: "none",
    },

    logout: {
        marginTop: "24px",
        padding: "14px",
        borderRadius: "12px",
        border: "none",
        background: "#ef4444",
        color: "#ffffff",
        fontWeight: "700",
        cursor: "pointer",
        width: "100%",
    },
};