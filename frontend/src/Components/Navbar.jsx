import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Menu,Send, Store, Settings } from "lucide-react";
import { useState, useEffect } from "react";



export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setCurrentUser(null);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };


  return (
    <nav className="border-b border-gray-200 bg-[#e0e1dd] sticky top-0 z-50 shadow-sm">
      <div className="w-full px-6 mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Menu className="h-5 w-5 text-[#1d3557] hover:text-[#457b9d] cursor-pointer " />
            <Link to="/dashboard" className="text-[#1d3557] text-lg font-bold">
              myPortal
            </Link>
            <div className="hidden md:flex items-center gap-6">
            </div>
          </div>

          <div className="flex items-center gap-4">

            <Bell className="h-5 w-5 text-[#1d3557] hover:text-[#457b9d] cursor-pointer" />

            <Link
            to="/profile"
            className="text-[#1d3557] hover:text-[#457b9d] cursor-pointer">
              <User className="h-5 w-5 hover:text-[#457b9d]"  />
            </Link>

              <button
                onClick={handleLogout}
                className="bg-[#457b9d] hover:bg-[#1d3557] text-white px-4 py-2 rounded font-medium cursor-pointer"
              >
                Log Out
              </button>

            <button className="md:hidden text-[#1d3557]">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
