import { Home, Users, X, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const sidebarItems = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Joined Project", icon: Users, href: "/project/joined" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out z-50
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b">
          <span className="font-bold text-lg">Acme Inc.</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
              Home
            </p>
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
