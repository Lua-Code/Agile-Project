import { useState } from "react";

function CourseCatalog() {
  const [courses] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Intro to Computer Science",
      type: "Core",
      professor: "Dr. Smith",
      schedule: "Mon/Wed • 10:00–12:00",
    },
    {
      id: 2,
      code: "CS202",
      name: "Data Structures",
      type: "Core",
      professor: "Dr. Ali",
      schedule: "Tue/Thu • 12:00–2:00",
    },
    {
      id: 3,
      code: "CS305",
      name: "AI Fundamentals",
      type: "Elective",
      professor: "Dr. John",
      schedule: "Sun/Tue • 3:00–5:00",
    },
        {
      id: 1,
      code: "CS101",
      name: "Intro to Computer Science",
      type: "Core",
      professor: "Dr. Smith",
      schedule: "Mon/Wed • 10:00–12:00",
    },
    {
      id: 2,
      code: "CS202",
      name: "Data Structures",
      type: "Core",
      professor: "Dr. Ali",
      schedule: "Tue/Thu • 12:00–2:00",
    },
    {
      id: 3,
      code: "CS305",
      name: "AI Fundamentals",
      type: "Elective",
      professor: "Dr. John",
      schedule: "Sun/Tue • 3:00–5:00",
    },
  ]);

  return (
    <div className="flex min-h-screen">

      <div
        className="w-64 p-6 border-r hidden md:block"
        style={{
          background: "var(--code-bg)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-h)" }}>
          Filters
        </h2>

        <input
          type="text"
          placeholder="Search..."
          className="w-full mb-4 p-2 rounded border"
          style={{
            background: "var(--code-bg)",
            color: "var(--text)",
            borderColor: "var(--border)",
          }}
        />

        <div className = "text-left ml-6">
          <h3 className="text-sm mb-2 font-bold" style={{ color: "var(--text)" }}>
            Type
          </h3>
          <label className="block text-sm">
            <input type="checkbox" className="mr-2" /> Core
          </label>
          <label className="block text-sm">
            <input type="checkbox" className="mr-2" /> Elective
          </label>
        </div>
      </div>

      <div className="flex-1 p-6" style={{ background: "var(--bg)" }}>
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--text-h)" }}
        >
          Course Catalog
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">

          {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl border shadow transition hover:scale-[1.02]"
              style={{
                background: "var(--code-bg)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-h)" }}
                >
                  {course.code + ": " + course.name}
                </h2>

                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                  }}
                >
                  {course.type}
                </span>
              </div>

              <p className="text-sm mb-2" style={{ color: "var(--text)" }}>
                {course.name}
              </p>

              <p className="text-xs mb-1" style={{ color: "var(--text)" }}>
                {course.professor}
              </p>

              <p className="text-xs mb-4" style={{ color: "var(--text)" }}>
                {course.schedule}
              </p>

              <button
                className="w-full py-2 mt-5 rounded transition"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg)",
                }}
              >
                Enroll
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default CourseCatalog;