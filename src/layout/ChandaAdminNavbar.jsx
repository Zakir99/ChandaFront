import { Menu, Bell, Search } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeAction } from "../store/authSlice";
import { Sun, Moon } from "lucide-react";

const Header = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const dark = useSelector((state) => state.auth?.theme); // Add this back if needed for theme toggle
  const dispatch = useDispatch();
  const changeTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      dispatch(setThemeAction(false));
    } else {
      document.documentElement.classList.add("dark");
      dispatch(setThemeAction(true));
    }
  };
  return (
    <header className="h-16 bg-white dark:bg-gray-950 shadow-sm dark:border-gray-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Search - Desktop */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 lg:w-80 h-10 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
              <span className="text-xs">Ctrl</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
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
        {/* Mobile search button */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
            <span className="text-white dark:text-gray-100 font-medium text-sm">
              A
            </span>
          </div>
          <span className="hidden lg:block text-sm font-medium text-gray-900 dark:text-gray-100">
            Admin
          </span>
        </button>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
