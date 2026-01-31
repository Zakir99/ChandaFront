import React, { useState } from 'react';
import { 
  Home, 
  Bell, 
  User,
  Menu,
  X,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Header Component
const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
      isDark 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Chanda</span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-colors ${
              isDark 
                ? 'hover:bg-slate-800 active:bg-slate-700' 
                : 'hover:bg-gray-100 active:bg-gray-200'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun size={22} className="text-amber-400" strokeWidth={2} />
            ) : (
              <Moon size={22} className="text-slate-600" strokeWidth={2} />
            )}
          </button>

          <button className={`relative p-2.5 rounded-xl transition-colors ${
            isDark 
              ? 'hover:bg-slate-800 active:bg-slate-700' 
              : 'hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <Bell size={22} className={isDark ? 'text-slate-300' : 'text-gray-700'} strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2.5 rounded-xl transition-colors ${
              isDark 
                ? 'hover:bg-slate-800 active:bg-slate-700' 
                : 'hover:bg-gray-100 active:bg-gray-200'
            }`}
          >
            {isMenuOpen ? 
              <X size={22} className={isDark ? 'text-slate-300' : 'text-gray-700'} strokeWidth={2} /> : 
              <Menu size={22} className={isDark ? 'text-slate-300' : 'text-gray-700'} strokeWidth={2} />
            }
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 bg-opacity-20 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className={`absolute top-full left-0 right-0 shadow-xl border-b z-50 ${
            isDark 
              ? 'bg-slate-900 border-slate-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="px-4 py-4">
              {/* User Profile Section */}
              <div className={`flex items-center space-x-3 pb-4 mb-3 border-b ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark 
                    ? 'bg-gradient-to-br from-blue-900 to-blue-800' 
                    : 'bg-gradient-to-br from-blue-100 to-blue-200'
                }`}>
                  <User size={24} className="text-blue-600" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>John Doe</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>john@example.com</p>
                </div>
              </div>

              {/* Theme Toggle in Menu */}
              <div className={`flex items-center justify-between px-3 py-3 mb-2 rounded-xl ${
                isDark ? 'bg-slate-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  {isDark ? (
                    <Moon size={20} className="text-blue-400" strokeWidth={2} />
                  ) : (
                    <Sun size={20} className="text-amber-500" strokeWidth={2} />
                  )}
                  <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Navigation Menu */}
              <nav className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.path}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors group ${
                        isDark 
                          ? 'hover:bg-slate-800 active:bg-slate-700' 
                          : 'hover:bg-gray-50 active:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} className={`group-hover:text-blue-600 transition-colors ${
                          isDark ? 'text-slate-400' : 'text-gray-600'
                        }`} strokeWidth={2} />
                        <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{item.label}</span>
                      </div>
                      <ChevronRight size={18} className={`group-hover:text-gray-600 transition-colors ${
                        isDark ? 'text-slate-500' : 'text-gray-400'
                      }`} />
                    </a>
                  );
                })}
                
                {/* Logout Button */}
                <button className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors group mt-2 ${
                  isDark 
                    ? 'hover:bg-red-900/30 active:bg-red-900/50' 
                    : 'hover:bg-red-50 active:bg-red-100'
                }`}>
                  <div className="flex items-center space-x-3">
                    <LogOut size={20} className={`group-hover:text-red-600 transition-colors ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`} strokeWidth={2} />
                    <span className={`font-medium group-hover:text-red-600 transition-colors ${
                      isDark ? 'text-slate-200' : 'text-gray-700'
                    }`}>Logout</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default MobileHeader;
