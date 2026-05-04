import React, { useState, useEffect } from 'react';

const Enrollments = () => {
  // Mock logged-in student state
  const [studentId] = useState("65a1b2c3d4e5f6a7b8c9d0e1"); 
  
  // State Management
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // "all" or "selected"
  const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);

  // Mock fetching data on mount
  useEffect(() => {
    // We will replace this with your actual GET /api/courses route later
    const mockCourses = [
      { _id: "1", courseCode: "CEN301", title: "Advanced Embedded Systems", department: "Computer Engineering", creditHours: 3, type: "core" },
      { _id: "2", courseCode: "CEN305", title: "Computer Networks", department: "Computer Engineering", creditHours: 4, type: "core" },
      { _id: "3", courseCode: "CEN412", title: "Quantum Computing Basics", department: "Computer Engineering", creditHours: 3, type: "elective" },
      { _id: "4", courseCode: "SWE201", title: "Full Stack Web Development", department: "Software Engineering", creditHours: 3, type: "core" },
      { _id: "5", courseCode: "MAT202", title: "Linear Algebra", department: "Mathematics", creditHours: 3, type: "core" },
    ];
    setCourses(mockCourses);
  }, []);

  // Handlers
  const handleCheckboxChange = (courseId) => {
    setSelectedCourseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleEnrollSubmit = () => {
    if (selectedCourseIds.size === 0) return;
    
    // We will replace this with your actual POST /api/enrollments route later
    console.log("Submitting enrollments for Student:", studentId, "Courses:", Array.from(selectedCourseIds));
    
    // Show success popup and clear selection
    setShowPopup(true);
    setSelectedCourseIds(new Set());
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // Filter and Search Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" ? true : selectedCourseIds.has(course._id);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#E0E1DD] p-8 font-sans text-[#0D1B2A]">
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Enrollments</h1>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search courses by name or code..."
          className="w-full max-w-2xl px-4 py-3 rounded-lg border border-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#415A77] bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            filter === "all" 
              ? "bg-[#1B263B] text-white" 
              : "bg-white text-[#415A77] border border-[#778DA9] hover:bg-[#E0E1DD]"
          }`}
        >
          All Courses
        </button>
        <button
          onClick={() => setFilter("selected")}
          className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            filter === "selected" 
              ? "bg-[#1B263B] text-white" 
              : "bg-white text-[#415A77] border border-[#778DA9] hover:bg-[#E0E1DD]"
          }`}
        >
          Selected Courses
          <span className="bg-[#415A77] text-[#E0E1DD] text-xs py-0.5 px-2 rounded-full">
            {selectedCourseIds.size}
          </span>
        </button>
      </div>

      {/* Main Content Area / Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9fa] text-[#415A77] border-b border-gray-200 text-sm">
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
                <tr key={course._id} className="border-b border-gray-100 hover:bg-[#E0E1DD]/30 transition-colors">
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      course.type === 'core' ? 'bg-[#1B263B]/10 text-[#1B263B]' : 'bg-[#778DA9]/20 text-[#415A77]'
                    }`}>
                      {course.type}
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

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleEnrollSubmit}
          disabled={selectedCourseIds.size === 0}
          className="px-8 py-3 bg-[#415A77] text-white rounded-lg font-bold shadow-md hover:bg-[#1B263B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Confirm Enrollment
        </button>
      </div>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0D1B2A]/40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center border-t-4 border-[#415A77]">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-[#1B263B] mb-2">Enrollment Successful!</h2>
            <p className="text-[#778DA9]">Your course selections have been saved for the upcoming academic year.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Enrollments;
