import { useState, useEffect } from "react";
import api from "../Api/axios";

function Materials() {
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me", {
          withCredentials: true,
        });

        setCurrentUser(userRes.data.user);

        const coursesRes = await api.get("/courses/my-courses", {
          withCredentials: true,
        });

        setCourses(coursesRes.data.courses || []);

        const materialsRes = await api.get("/materials", {
          withCredentials: true,
        });

        setMaterials(materialsRes.data.materials || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  {/*lol*/}
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !formData.file || !formData.title) {
      alert("Course, file, and title are required");
      return;
    }

    try {
      const data = new FormData();
      data.append("courseId", selectedCourse);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("file", formData.file);

      const res = await api.post("/materials", data, {
        withCredentials: true,
      });

      alert(res.data.message || "Uploaded");

      setFormData({
        title: "",
        description: "",
        file: null,
      });

      const materialsRes = await api.get("/materials", {
        withCredentials: true,
      });

      setMaterials(materialsRes.data.materials || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  const filteredMaterials = materials.filter(
    (m) => m.courseId?._id === selectedCourse
  );

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <h1 style={styles.title}>Course Materials</h1>

        <div style={styles.card}>
          <h2>Select Course</h2>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={styles.input}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div style={styles.card}>
            <h2>Upload Material</h2>

            <form onSubmit={handleUpload} style={styles.form}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="file"
                name="file"
                onChange={handleChange}
              />

              <button style={styles.button}>Upload</button>
            </form>
          </div>
        )}

        {selectedCourse && (
          <div style={styles.card}>
            <h2>Uploaded Materials</h2>

            {filteredMaterials.map((m) => (
              <div key={m._id} style={styles.materialItem}>
                <div>
                  <strong>{m.title}</strong>
                  <p>{m.description}</p>
                </div>

                <a
                  href={`http://localhost:5000${m.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  View
                </a>
              </div>
            ))}

            {filteredMaterials.length === 0 && (
              <p>No materials uploaded yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
  },
  main: {
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },
  materialItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold",
  },
};

export default Materials;