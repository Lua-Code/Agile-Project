import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const Enrollments = () => {
  const { user } = useAuthContext();
  
  // Student View State
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // "all" or "selected"
  const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);

  // Admin View State
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "admin") {
          const response = await axios.get('http://localhost:5000/api/enrollments', { withCredentials: true });
          setEnrollments(response.data.data || []);
        } else {
          const response = await axios.get('http://localhost:5000/api/courses', { withCredentials: true });
          setCourses(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Student Handlers
  const handleCheckboxChange = (courseId) => {
    setSelectedCourseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) newSet.delete(courseId);
      else newSet.add(courseId);
      return newSet;
    });
  };

  const handleEnrollSubmit = async () => {
    if (selectedCourseIds.size === 0) return;
    
    try {
      await axios.post('http://localhost:5000/api/enrollments', {
        studentId: user?._id || user?.id,
        courseIds: Array.from(selectedCourseIds),
        semester: "Fall", // Could be dynamic
        academicYear: "2026-2027" // Could be dynamic
      }, { withCredentials: true });
      
      setShowPopup(true);
      setSelectedCourseIds(new Set());
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error creating enrollments:", error);
      alert("Failed to enroll. " + (error.response?.data?.message || ""));
    }
  };

  // Admin Handlers
  const handleUpdateStatus = async (enrollmentId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/enrollments/${enrollmentId}/status`, {
        status: newStatus
      }, { withCredentials: true });
      
      setEnrollments(prev => prev.map(enr => 
        enr._id === enrollmentId ? { ...enr, status: newStatus } : enr
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#E0E1DD] p-8 font-sans text-[#0D1B2A]">Loading...</div>;
  }

  // --- ADMIN VIEW ---
  if (user?.role === "admin") {
    return (
      <div className="min-h-screen bg-[#E0E1DD] p-8 font-sans text-[#0D1B2A]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Manage Enrollments</h1>
        </div>

        <div className="table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Term</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enr) => (
                  <tr key={enr._id} className="table-row">
                    <td className="p-4">
                      <div className="font-medium text-[#1B263B]">
                        {enr.studentId?.firstName} {enr.studentId?.lastName}
                      </div>
                      <div className="text-xs text-[#778DA9]">{enr.studentId?.studentIdNumber || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[#1B263B]">{enr.courseId?.courseCode}</div>
                      <div className="text-xs text-[#778DA9]">{enr.courseId?.title}</div>
                    </td>
                    <td className="p-4 text-[#778DA9]">{enr.semester} {enr.academicYear}</td>
                    <td className="p-4">
                      <span className={`badge-status-${enr.status}`}>
                        {enr.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        {enr.status === "pending" && (
                          <>
                            <button onClick={() => handleUpdateStatus(enr._id, "enrolled")} className="btn-success">Approve</button>
                            <button onClick={() => handleUpdateStatus(enr._id, "dropped")} className="btn-danger">Reject</button>
                          </>
                        )}
                        {enr.status === "enrolled" && (
                          <button onClick={() => handleUpdateStatus(enr._id, "dropped")} className="btn-danger">Drop</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#778DA9]">
                    No enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" ? true : selectedCourseIds.has(course._id);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#E0E1DD] p-8 font-sans text-[#0D1B2A]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Enrollments</h1>
        <input
          type="text"
          placeholder="Search courses by name or code..."
          className="input-field"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "btn-secondary-active" : "btn-secondary"}>
          All Courses
        </button>
        <button onClick={() => setFilter("selected")} className={filter === "selected" ? "btn-secondary-active flex items-center gap-2" : "btn-secondary flex items-center gap-2"}>
          Selected Courses
          <span className="bg-[#415A77] text-[#E0E1DD] text-xs py-0.5 px-2 rounded-full">
            {selectedCourseIds.size}
          </span>
        </button>
      </div>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header">
              <th className="p-4 w-16 text-center">Select</th>
              <th className="p-4 font-semibold">Course Code</th>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Credits</th>
              <th className="p-4 font-semibold">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course._id} className="table-row">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#415A77] cursor-pointer"
                      checked={selectedCourseIds.has(course._id)}
                      onChange={() => handleCheckboxChange(course._id)}
                    />
                  </td>
                  <td className="p-4 font-medium text-[#1B263B]">{course.courseCode}</td>
                  <td className="p-4">{course.title}</td>
                  <td className="p-4 text-[#778DA9]">{course.department}</td>
                  <td className="p-4 text-center">{course.creditHours}</td>
                  <td className="p-4">
                    <span className={course.type === 'core' ? 'badge-core' : 'badge-elective'}>
                      {course.type || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#778DA9]">
                  No courses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleEnrollSubmit}
          disabled={selectedCourseIds.size === 0}
          className="btn-primary"
        >
          Confirm Enrollment
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0D1B2A]/40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center border-t-4 border-[#415A77]">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-[#1B263B] mb-2">Enrollment Successful!</h2>
            <p className="text-[#778DA9]">Your course selections have been submitted for approval.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
