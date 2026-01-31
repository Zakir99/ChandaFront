import MobileHeader from "./header";
import MobileFooter from "./footer";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AppWithMobileLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      <MobileHeader />
      <div>
        {user ?? (
          console.log("user is null")
        )}
      </div>
      {/* Main Content with proper spacing */}
      <main className="pt-16 pb-16 min-h-screen">
        <Outlet />
      </main>

      <MobileFooter activeTab="home" />
    </div>
  );
};

export default AppWithMobileLayout;
