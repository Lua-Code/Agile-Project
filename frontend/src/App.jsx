//LIBS
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//PAGES
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import StudentRecords from "./Pages/StudentRecords";
import BookRoom from "./Pages/BookRoom";
import CourseCatalog from "./Pages/CourseCatalog";
import Rooms from "./Pages/Rooms";
import Enrollment from "./Pages/Enrollment";
import Transcripts from "./Pages/Transcripts";
import CreateCourse from "./Pages/CreateCourse";


//LAYOUTS AND HOOKS
import { useAuthContext } from "./hooks/useAuthContext";
import MainLayout from "./Layouts/MainLayout";

function PrivateRoute({ children }) {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><StudentRecords /></PrivateRoute>} />
          <Route path="/book-room" element={<PrivateRoute><BookRoom /></PrivateRoute>} />
          <Route path="/courses" element={<PrivateRoute><CourseCatalog /></PrivateRoute>} />
          <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
          <Route path="/enrollments" element={<PrivateRoute><Enrollment /></PrivateRoute>} />
          <Route path="/transcripts" element={<PrivateRoute><Transcripts /></PrivateRoute>} />
          <Route path="/create-courses" element={<PrivateRoute><CreateCourse /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;