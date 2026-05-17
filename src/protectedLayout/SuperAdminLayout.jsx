import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { initializeAuth, logout } from "../store/authSlice"; // Import the new thunk
import { PageSkeleton } from "../components/loading/Skeleton";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";


const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = useSelector((state) => state.auth?.user?.role);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loaded = useSelector((state) => state.auth.loaded);

  useEffect(() => {
    // Initialize auth on component mount
    dispatch(initializeAuth());
  }, [dispatch]);
  useEffect(() => {
    setActivePage(location.pathname);
  }, [location.pathname]);
  // Show loading while auth is being initialized
  if (isLoading || !loaded) {
    return <PageSkeleton />; // Replace with your LoadingSkeleton component
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Save the attempted location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (role !== "super_admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  const sideWidth = collapsed ? "lg:pl-[68px]" : "lg:pl-64";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 99px; }
      `}</style>

      <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <Sidebar
          activePage={activePage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          userRole="SuperAdmin"
          onLogout={() => {
            dispatch(logout());
          }}
        />

        <div className={`transition-all duration-300 ${sideWidth}`}>
          <Navbar
            activePage="SuperAdmin/dashboard"
            setMobileOpen={setMobileOpen}
            userRole="SuperAdmin"
          />

          {/* Outlet */}
          <main className="p-4 sm:p-6 min-h-[calc(100vh-64px)] bg-white dark:bg-gray-950/50">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;
