import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TTSPlayer from "./TTSPlayer";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/modules");

  return (
    <div className={`app-shell ${showSidebar ? "with-sidebar" : ""}`}>
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} showSidebarToggle={showSidebar} />
      {showSidebar && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <main className="app-main">
        <Outlet />
      </main>
      <TTSPlayer />
    </div>
  );
}
