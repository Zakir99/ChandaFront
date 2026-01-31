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
  ChevronRight
} from 'lucide-react';

// Header Component
const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-semibold text-xl text-gray-900">AppName</span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <Bell size={22} className="text-gray-700" strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            {isMenuOpen ? 
              <X size={22} className="text-gray-700" strokeWidth={2} /> : 
              <Menu size={22} className="text-gray-700" strokeWidth={2} />
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
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-gray-200 z-50">
            <div className="px-4 py-4">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 pb-4 mb-3 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.path}
                      className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                        <span className="text-gray-700 font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </a>
                  );
                })}
                
                {/* Logout Button */}
                <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors group mt-2">
                  <div className="flex items-center space-x-3">
                    <LogOut size={20} className="text-gray-600 group-hover:text-red-600 transition-colors" strokeWidth={2} />
                    <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors">Logout</span>
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