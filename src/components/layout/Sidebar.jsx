import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
// Role-based navigation configurations
import { ROLE_NAV_CONFIG } from "../../Js/Role";

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  customNavGroups, // Optional: override nav groups
  customFooter, // Optional: override footer
  onLogout, // Optional: custom logout handler
  onNavigate, // Optional: custom navigation handler
}) => {
  const [expandedGroups, setExpandedGroups] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const community = useSelector((state) => state.auth?.user?.community_name);
  const authUser = useSelector((state) => state.auth?.user);
  const userRole = authUser?.role;
  // if family exists → force "family"
  // else → use auth role

  const roleConfig = ROLE_NAV_CONFIG[userRole] || {};
  const mainPath = roleConfig.mainPath || "";
  const navGroups = customNavGroups || roleConfig.navGroups || [];
  // Initialize expanded groups with all groups initially expanded
  useState(() => {
    const initialExpanded = navGroups.map((group) => group.group);
    setExpandedGroups(initialExpanded);
  }, [navGroups]);

  const toggleGroup = (group) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((x) => x !== group) : [...prev, group],
    );
  };

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path, userRole);
    } else {
      navigate(`/${mainPath}/${path}`);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout(userRole);
    } else {
      console.log(`Logging out ${userRole}`);
    }
  };

  // Check if a nav item is active
  const isActive = (path) => {
    const currentPath = location.pathname;
    const rolePath = `/${userRole}/${path}`;
    return currentPath === rolePath || currentPath.startsWith(`${rolePath}/`);
  };

  // Footer configuration
  // const displayUserInfo = userInfo || footerConfig.userInfo;

  const sidebarBase = `
    fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300
    bg-white  dark:bg-gray-950
    ${collapsed ? "w-[68px]" : "w-64"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
  `;

  const LogoIcon = roleConfig.logoIcon;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={sidebarBase}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 shrink-0 ">
          <div
            className={`w-8 h-8 rounded-lg bg-linear-to-br ${roleConfig.logoColor} flex items-center justify-center shrink-0 shadow-lg`}
          >
            <LogoIcon size={16} className="text-white" />
          </div>
          {!collapsed && community ? (
            <div className="overflow-hidden flex-1">
              <p
                className="font-bold text-sm tracking-tight leading-none dark:text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {community || ""}
              </p>
              <p className="text-[10px] opacity-40 mt-0.5 tracking-widest uppercase dark:text-gray-400">
                {roleConfig.subText}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden flex-1">
              <p
                className="font-bold text-sm tracking-tight leading-none dark:text-white uppercase "
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {roleConfig.appName}
              </p>
              <p className="text-[10px] opacity-40 mt-0.5 tracking-widest uppercase dark:text-gray-400">
                {roleConfig.subText}
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden lg:flex items-center justify-center w-6 h-6 rounded-md transition-colors hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800 dark:text-gray-400"
          >
            <ChevronRight
              size={14}
              className={`transition-transform ${collapsed ? "" : "rotate-180"}`}
            />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex lg:hidden items-center justify-center w-6 h-6 rounded-md text-gray-500 dark:text-gray-400"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
          {navGroups.map(({ group, items }) => (
            <div key={group}>
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {group}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedGroups.includes(group) ? "" : "-rotate-90"}`}
                  />
                </button>
              )}
              {(collapsed || expandedGroups.includes(group)) &&
                items.map(({ label, icon: Icon, badge, path }) => {
                  const active = isActive(path);

                  return (
                    <button
                      key={label}
                      onClick={() => handleNavigation(path)}
                      title={collapsed ? label : undefined}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group relative
                        ${
                          active
                            ? `bg-linear-to-r ${roleConfig.logoColor} text-white shadow-md shadow-violet-500/20`
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/70"
                        }
                        ${collapsed ? "justify-center" : ""}
                      `}
                    >
                      <Icon size={17} className="shrink-0" />

                      {!collapsed && (
                        <span className="truncate dark:text-white">
                          {label}
                        </span>
                      )}

                      {!collapsed && badge && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                          }`}
                        >
                          {badge}
                        </span>
                      )}

                      {collapsed && badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[8px] font-bold rounded-full bg-red-500 text-white">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              {!collapsed && <div className="h-2" />}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
