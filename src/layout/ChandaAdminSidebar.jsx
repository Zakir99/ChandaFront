import {
  LayoutDashboard,
  Users,
  UserCircle,
  BookOpen,
  Heart,
  X,
  ChevronRight,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/dashboard",
  },
  { icon: Users, label: "Families", id: "family", path: "/family" },
  { icon: UserCircle, label: "Members", id: "member", path: "/member" },
  { icon: BookOpen, label: "Registers", id: "register", path: "/register" },
  { icon: Heart, label: "Support", id: "support", path: "/support" },
  { icon: MessageSquare, label: "Messages", id: "message", path: "/message" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === "/Admin/dashboard")
      return currentPath === "/Admin/dashboard" || currentPath === "/Admin/";
    return currentPath.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-950 shadow-sm dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 shadow-sm dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              Chande Management
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive('/Admin' + item.path);

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate('/Admin' + item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group ${
                  active
                    ? "bg-blue-500 dark:bg-blue-600 text-white dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
                />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto text-white" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 shadow-sm dark:border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;