import { useState } from "react";
import { Bell, Users2, Users, Book, BookOpen, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const MobileFooter = ({ activeTab = "dashboard" }) => {
  const [active, setActive] = useState(activeTab);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const navItems = [
    { icon: Home, label: "Dashboard", id: "dashboard", path: "/dashboard" },
    { icon: Users2, label: "Family", id: "family", path: "/family" },
    { icon: Users, label: "Member", id: "member", path: "/member" },
    { icon: Book, label: "Register", id: "register", path: "/register" },
    { icon: BookOpen, label: "Support", id: "support", path: "/support" },
  ];

  return (
    <footer className={`fixed bottom-0 left-0 right-0 border-t z-40 transition-colors ${
      isDark 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-gray-200'
    }`}>
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-blue-600"
                  : isDark 
                    ? "text-slate-400 hover:text-slate-200 active:bg-slate-800" 
                    : "text-gray-500 hover:text-gray-700 active:bg-gray-100"
              }`}
            >
              <div
                className={`relative ${
                  isActive ? "transform scale-110" : ""
                } transition-transform`}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-all ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
    </footer>
  );
};

export default MobileFooter;
