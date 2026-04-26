import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import StudentRecords from "./Pages/StudentRecords";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/StudentRecords" element={<StudentRecords />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;