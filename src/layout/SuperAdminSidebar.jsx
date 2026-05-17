import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
  Globe,
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
  Lock,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navGroups = [
  {
    group: "Core",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
      { label: "Analytics", icon: BarChart3, path: "analytics" },
      { label: "Reports", icon: FileText, path: "reports" },
      { label: "Trends", icon: TrendingUp, path: "trends" },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Users", icon: Users, badge: 24, path: "users" },
      { label: "Communities", icon: Globe, path: "communities" },
      { label: "Roles & Permissions", icon: Lock, path: "roles" },
      { label: "Organizations", icon: Globe, path: "organizations" },
      { label: "Packages", icon: Package, path: "packages" },
    ],
  },
  //   {
  //     group: "Infrastructure",
  //     items: [
  //       { label: "Servers", icon: Server },
  //       { label: "Database", icon: Database },
  //       { label: "Logs & Events", icon: Activity },
  //       { label: "Security", icon: ShieldCheck },
  //     ],
  //   },
  //   {
  //     group: "System",
  //     items: [
  //       { label: "User Management", icon: UserCog },
  //       { label: "Notifications", icon: Bell, badge: 7 },
  //       { label: "Integrations", icon: Zap },
  //       { label: "Settings", icon: Settings },
  //     ],
  //   },
];

const Sidebar = ({
  activePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const [expandedGroups, setExpandedGroups] = useState(["Core", "Management"]);

  const toggleGroup = (g) =>
    setExpandedGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  const navigate = useNavigate();
  const sidebarBase = `
    fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300
    bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800
    ${collapsed ? "w-[68px]" : "w-64"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
  `;

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
        <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg">
            <ShieldCheck size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p
                className="font-bold text-sm tracking-tight leading-none dark:text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                SuperAdmin
              </p>
              <p className="text-[10px] opacity-40 mt-0.5 tracking-widest uppercase dark:text-gray-400">
                Control Panel
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
                  onClick={() => toggleGroup(group, items)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {group}
                  <ChevronDown
                    size={10}
                    className={`transition-transform ${expandedGroups.includes(group) ? "" : "-rotate-90"}`}
                  />
                </button>
              )}
              {(collapsed || expandedGroups.includes(group)) &&
                items.map(({ label, icon: Icon, badge, path }) => {
                  const active = activePage.startsWith(`/SuperAdmin/${path}`);

                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setMobileOpen(false);
                        navigate(`/SuperAdmin/${path}`);
                      }}
                      title={collapsed ? label : undefined}
                      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
        ${
          active
            ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
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
                    </button>
                  );
                })}
              {!collapsed && <div className="h-2" />}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-2 border-t border-gray-200 dark:border-gray-800">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-900 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              SA
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate dark:text-white">
                  Super Admin
                </p>
                <p className="text-[10px] opacity-40 truncate dark:text-gray-400">
                  admin@system.io
                </p>
              </div>
            )}
            {!collapsed && (
              <button className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-gray-400 hover:text-red-500 dark:hover:bg-gray-800 dark:text-gray-500 dark:hover:text-red-400">
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
