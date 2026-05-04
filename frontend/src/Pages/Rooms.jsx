import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";

function Rooms() {
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentAvailability, setStudentAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [formData, setFormData] = useState({
    roomType: "hall",
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomsAndBookings = async () => {
      try {
        setLoading(true);

        const [roomsRes, bookingsRes] = await Promise.all([
          api.get("/rooms", { withCredentials: true }),
          api.get("/bookings", { withCredentials: true }),
        ]);

        setRooms(roomsRes.data.rooms || []);
        setBookings(bookingsRes.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch room data:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsAndBookings();
  }, []);



  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await api.get("/auth/me", {
          withCredentials: true,
        });

        setCurrentUser(data.user);
        console.log("Current user:", data.user);
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

  const filteredRooms = rooms.filter(
    (room) => room.type === formData.roomType && room.status === "active"
  );

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const { data } = await api.patch(
        `/bookings/${bookingId}/cancel`,
        {},
        { withCredentials: true }
      );

      alert(data.message || "Booking cancelled successfully");

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (err) {
      console.error("Cancel booking failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleStudentAvailabilityChange = (e) => {
    const { name, value } = e.target;

    setStudentAvailability((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "roomType" ? { roomId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.roomId ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.purpose
    ) {
      alert("Please fill all required booking fields");
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      const { data } = await api.post(
        "/bookings",
        {
          roomId: formData.roomId,
          purpose: formData.purpose,
          startDateTime,
          endDateTime,
        },
        { withCredentials: true }
      );

      alert(data.message || "Room booked successfully");

      setFormData({
        roomType: "hall",
        roomId: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
      });

      const bookingsRes = await api.get("/bookings", {
        withCredentials: true,
      });

      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const studentStartDateTime =
    studentAvailability.date && studentAvailability.startTime
      ? new Date(`${studentAvailability.date}T${studentAvailability.startTime}`)
      : null;

  const studentEndDateTime =
    studentAvailability.date && studentAvailability.endTime
      ? new Date(`${studentAvailability.date}T${studentAvailability.endTime}`)
      : null;

  const canCheckStudentAvailability =
    studentStartDateTime &&
    studentEndDateTime &&
    studentStartDateTime < studentEndDateTime;

  const conflictingStudentBookings = canCheckStudentAvailability
    ? bookings.filter((booking) => {
      const bookingStart = new Date(booking.startDateTime);
      const bookingEnd = new Date(booking.endDateTime);

      return (
        studentStartDateTime < bookingEnd &&
        studentEndDateTime > bookingStart
      );
    })
    : [];

  const bookedRoomIdsForStudentSlot = conflictingStudentBookings.map(
    (booking) => booking.roomId?._id
  );

  const availableStudyRooms = canCheckStudentAvailability
    ? rooms.filter(
      (room) =>
        room.status === "active" &&
        !bookedRoomIdsForStudentSlot.includes(room._id)
    )
    : [];

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.header}>
          <div>
            <h1 style={styles.title}>Room Booking</h1>
            <p style={styles.subtitle}>
              Book halls and labs while avoiding schedule conflicts
            </p>
          </div>
        </section>

        {isStudent && (
          <section style={styles.formCard}>
            <h2 style={styles.sectionTitle}>Find Available Study Rooms</h2>

            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={studentAvailability.date}
                  onChange={handleStudentAvailabilityChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={studentAvailability.startTime}
                  onChange={handleStudentAvailabilityChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={studentAvailability.endTime}
                  onChange={handleStudentAvailabilityChange}
                  style={styles.input}
                />
              </div>
            </div>

            {studentAvailability.date &&
              studentAvailability.startTime &&
              studentAvailability.endTime &&
              studentStartDateTime >= studentEndDateTime && (
                <p style={{ color: "red", marginTop: "16px" }}>
                  End time must be after start time.
                </p>
              )}

            {canCheckStudentAvailability && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={styles.sectionTitle}>Available Rooms</h3>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Room</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Building</th>
                      <th style={styles.th}>Capacity</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {availableStudyRooms.map((room) => (
                      <tr key={room._id}>
                        <td style={styles.td}>{room.roomNumber}</td>
                        <td style={styles.td}>{room.type}</td>
                        <td style={styles.td}>{room.building}</td>
                        <td style={styles.td}>{room.capacity}</td>
                        <td style={styles.td}>
                          <span style={styles.status}>Available</span>
                        </td>
                      </tr>
                    ))}

                    {availableStudyRooms.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan="5">
                          No rooms available during this time slot.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {(isAdmin) && (<section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Rooms</p>
            <h2 style={styles.cardNumber}>{rooms.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Halls</p>
            <h2 style={styles.cardNumber}>
              {rooms.filter((room) => room.type === "hall").length}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Labs</p>
            <h2 style={styles.cardNumber}>
              {rooms.filter((room) => room.type === "lab").length}
            </h2>
          </div>
        </section>)}

        {(isProfessorOrTa) && (<section style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Book a room</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="hall">Hall</option>
                  <option value="lab">Lab</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Room</label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select room</option>
                  {filteredRooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber} - {room.building} - Capacity {room.capacity}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Lecture, meeting, lab session..."
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" style={styles.primaryButton}>
              Book Room
            </button>
          </form>
        </section>)}

        {(!isStudent) && (
          <section style={styles.tableCard}>
            <h2 style={styles.sectionTitle}>Current Bookings</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Room</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Start</th>
                  <th style={styles.th}>End</th>
                  <th style={styles.th}>Purpose</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const start = new Date(booking.startDateTime);
                  const end = new Date(booking.endDateTime);

                  return (
                    <tr key={booking._id}>
                      <td style={styles.td}>{booking.roomId?.roomNumber || "N/A"}</td>
                      <td style={styles.td}>{booking.roomId?.type || "N/A"}</td>
                      <td style={styles.td}>{start.toLocaleDateString()}</td>
                      <td style={styles.td}>{start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      <td style={styles.td}>{end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      <td style={styles.td}>{booking.purpose}</td>
                      <td style={styles.td}>
                        <span style={styles.status}>{booking.status}</span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.cancelButton}
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </button>
                      </td>
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
    background: "#dcfce7",
    color: "#15803d",
  },

  cancelButton: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Rooms;