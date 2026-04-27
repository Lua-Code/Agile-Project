import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import StudentRecords from "./Pages/StudentRecords";
import { useAuthContext } from "./hooks/useAuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/StudentRecords" element={<PrivateRoute><StudentRecords /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;