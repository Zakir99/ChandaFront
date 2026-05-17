import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Lock,
  UserCog,
  Mail,
  HelpCircle,
  Menu,
  Sun,
  Search,
  Moon,
} from "lucide-react";
import { setThemeAction } from "../store/authSlice";
import { useSelector } from "react-redux";

const Navbar = ({ activePage, collapsed, setMobileOpen }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const dark = useSelector((state) => state.auth?.theme); // Add this back if needed for theme toggle
  const segments = activePage.split("/").filter(Boolean); // → ['SuperAdmin', 'dashboard']

  const activePageName = segments[1]
    ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
    : "Dashboard";
  const changeTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      dispatch(setThemeAction(false));
    } else {
      document.documentElement.classList.add("dark");
      dispatch(setThemeAction(true));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const notifs = [
    {
      title: "Security Alert",
      desc: "Unusual login from IP 203.0.113.5",
      time: "now",
      urgent: true,
    },
    {
      title: "Backup Complete",
      desc: "Daily backup finished successfully",
      time: "15m",
      urgent: false,
    },
    {
      title: "New User Signup",
      desc: "enterprise@company.com registered",
      time: "1h",
      urgent: false,
    },
    {
      title: "SSL Expiry",
      desc: "Certificate expires in 14 days",
      time: "3h",
      urgent: true,
    },
  ];

  return (
    <header className="h-16 flex items-center px-4 gap-3 sticky top-0 z-20 transition-colors bg-white/90 border-gray-300 backdrop-blur-xl dark:bg-gray-950/90 dark:border-gray-800">
      {/* Mobile menu */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm">
        <span className="opacity-40 dark:text-gray-400">SuperAdmin</span>
        <ChevronRight size={12} className="opacity-30 dark:text-gray-500" />
        <span className="font-semibold dark:text-white">{activePageName}</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors w-56 bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800">
        <Search size={14} />
        <span className="text-xs opacity-60">Search anything… </span>
        <kbd className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          ⌘k
        </kbd>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={changeTheme}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${dark ? "bg-violet-600" : "bg-gray-200"}`}
        title="Toggle theme"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md ${dark ? "translate-x-6 bg-white text-violet-600" : "bg-white text-amber-500"}`}
        >
          {dark ? <Moon size={11} /> : <Sun size={11} />}
        </span>
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => {
            setNotifOpen(!notifOpen);
            setProfileOpen(false);
          }}
          className="relative p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-offset-0" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="font-bold text-sm dark:text-white">Notifications</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                4 new
              </span>
            </div>
            {notifs.map((n, i) => (
              <div
                key={i}
                className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${i !== notifs.length - 1 ? "border-b border-gray-100 dark:border-gray-800/50" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.urgent ? "bg-rose-500" : "bg-emerald-500"}`}
                />
                <div>
                  <p className="text-xs font-semibold dark:text-white">
                    {n.title}
                  </p>
                  <p className="text-xs opacity-50 dark:text-gray-400">
                    {n.desc}
                  </p>
                </div>
                <span className="ml-auto text-[10px] opacity-40 shrink-0 dark:text-gray-500">
                  {n.time}
                </span>
              </div>
            ))}
            <div className="px-4 py-2 text-center border-t border-gray-100 dark:border-gray-800">
              <button className="text-xs text-violet-500 font-semibold hover:text-violet-400 transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help */}
      <button className="hidden sm:flex p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400">
        <HelpCircle size={17} />
      </button>

      {/* Mail */}
      <button className="hidden sm:flex p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400">
        <Mail size={17} />
      </button>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => {
            setProfileOpen(!profileOpen);
            setNotifOpen(false);
          }}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
            SA
          </div>
          <span className="hidden sm:block text-xs font-semibold dark:text-white">
            Super Admin
          </span>
          <ChevronDown size={12} className="opacity-50 dark:text-gray-400" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 top-12 w-52 rounded-2xl shadow-2xl border overflow-hidden z-50 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold dark:text-white">Super Admin</p>
              <p className="text-[10px] opacity-40 dark:text-gray-400">
                admin@system.io
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 uppercase tracking-wider">
                Super Admin
              </span>
            </div>
            {[
              { icon: UserCog, label: "Profile Settings" },
              { icon: Lock, label: "Security" },
              { icon: Bell, label: "Notifications" },
              { icon: HelpCircle, label: "Help & Support" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors hover:bg-gray-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
              >
                <Icon size={13} className="opacity-60" />
                {label}
              </button>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-500 transition-colors hover:bg-red-50 dark:hover:bg-gray-800"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
