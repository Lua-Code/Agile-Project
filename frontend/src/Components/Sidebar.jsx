import { NavLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useState, useEffect } from "react";
import api from "../Api/axios";

export default function Sidebar({ isOpen }) {
    const [currentUser, setCurrentUser] = useState(null);
    const { logout } = useLogout();

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

    const role = currentUser?.role;

    const isAdmin = role === "admin";
    const isStudent = role === "student";
    const isProfessorOrTa = role === "professor" || role === "ta";
    const isEmployee = role === "employee";

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

                    <NavLink to="/courses" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Courses
                    </NavLink>

                    <NavLink to="/rooms" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Rooms
                    </NavLink>

                    {
                        isAdmin && (
                            <NavLink to="/enrollments" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                                View Enrollment Requests
                            </NavLink>)
                    }

                    {(isAdmin) && (
                        <NavLink to="/students" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                            View Student Records
                        </NavLink>)
                    }

                    {(!isProfessorOrTa) && (
                        <NavLink to="/transcripts" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                            {isAdmin ? "View Transcripts" : "Request Transcripts"}
                        </NavLink>)
                    }

                    {(!isAdmin) && (
                        <NavLink to="/materials" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                            {isProfessorOrTa ? "Upload Course Materials" : "View Course Materials"}
                        </NavLink>
                    )}

                    {(isAdmin) && (
                        <NavLink to="/resources" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                            Manage Resources
                        </NavLink>
                    )}
                    {isProfessorOrTa && (
                        <NavLink to="/employee-portal" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                            Employee Portal
                        </NavLink>
                    )}

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
        height: "100%",
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