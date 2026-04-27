//LIBS
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//LAYOUTS
import MainLayout from "./Layouts/MainLayout";
import AuthLayout from "./Layouts/AuthLayout";

//PAGES
import CourseCatalog from "./Pages/CourseCatalog";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          {/*<Route path="/register" element={<RegisterPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App
