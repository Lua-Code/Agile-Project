import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import StudentRecords from "./Pages/StudentRecords";
import BookRoom from "./Pages/BookRoom";
import CourseCatalog from "./Pages/CourseCatalog";
import Rooms from "./Pages/Rooms";
import Enrollment from "./Pages/Enrollment";
import Transcripts from "./Pages/Transcripts";
import CreateCourse from "./Pages/CreateCourse";
import CreateStudent from "./Pages/CreateStudent";

// LAYOUT + AUTH
import MainLayout from "./Layouts/MainLayout";
import { useAuthContext } from "./hooks/useAuthContext";
import { useAuthInit } from "./hooks/useAuthInit";

function PrivateRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return null; 

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  useAuthInit();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/students"
            element={
              <PrivateRoute>
                <StudentRecords />
              </PrivateRoute>
            }
          />

          <Route
            path="/book-room"
            element={
              <PrivateRoute>
                <BookRoom />
              </PrivateRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <CourseCatalog />
              </PrivateRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <PrivateRoute>
                <Rooms />
              </PrivateRoute>
            }
          />

          <Route
            path="/enrollments"
            element={
              <PrivateRoute>
                <Enrollment />
              </PrivateRoute>
            }
          />

          <Route
            path="/transcripts"
            element={
              <PrivateRoute>
                <Transcripts />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-courses"
            element={
              <PrivateRoute>
                <CreateCourse />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-student"
            element={
              <PrivateRoute>
                <CreateStudent />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;