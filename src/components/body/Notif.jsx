import { useState, useEffect, useRef } from "react";
import {
  Bell,
  MapPin,
  Image,
  Calendar,
  MessageCircle,
  Check,
  CheckCheck,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectUnreadNotifications,
  selectUnreadCount,
} from "../../store/slices/socketSlice";
// Maps your real notification data format
const getNotifMeta = (notif) => {
  const typeMap = {
    meeting: {
      icon: <Calendar size={14} />,
      color:
        "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
      dot: "bg-violet-500",
      label: "Meeting",
    },
    message: {
      icon: <MessageCircle size={14} />,
      color: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
      dot: "bg-sky-500",
      label: "Message",
    },
  };
  return typeMap[notif.event_type] || typeMap.message;
};

const formatDeliveryType = (type) =>
  type ? type.charAt(0).toUpperCase() + type.slice(1) : "";

const timeAgo = (id) => {
  // id is a timestamp in ms
  const diff = Date.now() - id;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// Single notification row
const NotifItem = ({ notif, isLast, onRead }) => {
  const meta = getNotifMeta(notif);
  const hasImage = notif.files?.some((f) => f.type === "image");
  const hasLocation = !!notif.location;

  return (
    <div
      onClick={() => onRead(notif.id)}
      className={`group relative flex gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150
        hover:bg-gray-50 dark:hover:bg-white/4
        ${!isLast ? "border-b border-gray-100 dark:border-white/6" : ""}
        ${!notif.read ? "bg-sky-50/60 dark:bg-sky-950/20" : ""}
      `}
    >
      {/* Unread indicator */}
      {!notif.read && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-sky-500" />
      )}

      {/* Icon badge */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}
      >
        {meta.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-50 dark:text-gray-400">
            {meta.label}
          </span>
          {notif.delivery_type && (
            <>
              <span className="text-[11px] opacity-30 dark:text-gray-600">
                ·
              </span>
              <span className="text-[11px] opacity-50 dark:text-gray-400">
                {formatDeliveryType(notif.delivery_type)}
              </span>
            </>
          )}
        </div>

        <p className="text-[13px] font-medium text-gray-800 dark:text-gray-100 truncate leading-snug">
          {notif.message}
        </p>

        {/* Attachments row */}
        {(hasImage || hasLocation) && (
          <div className="flex items-center gap-2.5 mt-1.5">
            {hasImage && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                <Image size={11} />
                {notif.files.filter((f) => f.type === "image").length} image
                {notif.files.filter((f) => f.type === "image").length > 1
                  ? "s"
                  : ""}
              </span>
            )}
            {hasLocation && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                <MapPin size={11} />
                Location
              </span>
            )}
          </div>
        )}
      </div>

      {/* Time */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[11px] text-gray-400 dark:text-gray-600">
          {timeAgo(notif.id)}
        </span>
        {notif.read && (
          <CheckCheck size={12} className="text-sky-400 opacity-60" />
        )}
      </div>
    </div>
  );
};

export default function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const data = useSelector(selectUnreadNotifications);

  const [notifications, setNotifications] = useState(data || []);
  // --- Replace this with your Redux selectors ---
  // const notifications = useSelector(selectNotifications);
  // const unreadCount = useSelector(selectUnreadCount);

  const unreadCount = useSelector(selectUnreadCount);
  const dropdownRef = useRef(null);

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold px-0.5 ring-2 ring-white dark:ring-gray-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute right-0 top-12 w-85 rounded-2xl shadow-2xl border overflow-hidden z-50
            bg-white border-gray-200/80
            dark:bg-gray-950 "
          style={{
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark/6">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[13px] text-gray-900 dark:text-white">
                Notifications
              </p>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-sky-500 hover:text-sky-400 transition-colors px-2 py-1 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10"
                >
                  <Check size={11} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-95 overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Bell size={24} className="text-gray-200 dark:text-gray-700" />
                <p className="text-[13px] text-gray-400 dark:text-gray-600">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <NotifItem
                  key={n.id}
                  notif={n}
                  isLast={i === notifications.length - 1}
                  onRead={markRead}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/6 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 dark:text-gray-600">
              {notifications.length} total
            </span>
            <button className="text-[12px] font-semibold text-sky-500 hover:text-sky-400 transition-colors">
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
