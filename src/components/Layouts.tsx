import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Sidebar from "@/components/sidebar";
import { useLocation, useParams } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const location = useLocation();
  const { id } = useParams();

  const getTitle = () => {
    if (location.pathname === "/dashboard") {
      return "Dashboard";
    }

    if (location.pathname.startsWith("/project/") && id) {
      return `Task List`;
    }

    if (location.pathname === "/project/joined") {
      return `Project Joined`;
    }

    return "Welcome";
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm border-b px-6 py-[22px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          </div>
          <span className="hidden sm:block text-sm text-gray-500">
            Welcome back {user?.name}
          </span>
        </header>

        {/* Page Content */}
        <main className="p-6 w-full">
          <Outlet /> {/* Konten */}
        </main>
      </div>
    </div>
  );
}
