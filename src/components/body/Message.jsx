import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useMemo,
} from "react";
import {
  MapPin,
  MoreVertical,
  Clock,
  Check,
  ChevronLeft,
  User,
  Play,
  X,
  Maximize2,
  Loader2,
  FileText,
  Music,
  Mic,
  Download,
  CheckCheck,
  Send,
  AlertCircle,
  Pause,
  ExternalLink,
  MessageSquare,
  Smartphone,
  Mail,
  Bell,
  MessageCircle,
  Plus,
  MoveDiagonal,
  Volume2,
} from "lucide-react";
import useFetchData from "../../hooks/useFetchData";
import {
  selectUnreadNotifications,
  markAllAsRead,
} from "../../store/slices/socketSlice";
import { useSelector, useDispatch } from "react-redux";
// ─── Event type config ────────────────────────────────────────────────────────
const EVENT_CONFIG = {
  fatiha: {
    label: "Fatiha",
    icon: "🕌",
    color: "green",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200/60 dark:border-green-800/40",
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
    tint: "from-green-500/5 to-transparent",
  },
  quran_khani: {
    label: "Quran Khani",
    icon: "📖",
    color: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
    tint: "from-emerald-500/5 to-transparent",
  },
  wedding: {
    label: "Wedding",
    icon: "💍",
    color: "pink",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200/60 dark:border-pink-800/40",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400",
    tint: "from-pink-500/5 to-transparent",
  },
  meeting: {
    label: "Meeting",
    icon: "📅",
    color: "blue",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200/60 dark:border-blue-800/40",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
    tint: "from-blue-500/5 to-transparent",
  },
  other: {
    label: "General",
    icon: "📌",
    color: "gray",
    bg: "bg-slate-50 dark:bg-slate-800/30",
    border: "border-slate-200/60 dark:border-slate-700/40",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    tint: "from-slate-500/5 to-transparent",
  },
};

// ─── Delivery channel config ──────────────────────────────────────────────────
const DELIVERY_CONFIG = {
  sms: { icon: Smartphone, label: "SMS", cls: "text-emerald-500" },
  email: { icon: Mail, label: "Email", cls: "text-blue-500" },
  push: { icon: Bell, label: "Push", cls: "text-violet-500" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", cls: "text-green-500" },
  chanda: { icon: MessageSquare, label: "Chanda", cls: "text-amber-500" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const parseLocation = (locationString) => {
  if (!locationString) return null;
  const parts = locationString.split(",").map((s) => s.trim());
  // Try numeric lat/lng first
  if (parts.length === 2 && !isNaN(parseFloat(parts[0]))) {
    return {
      lat: parseFloat(parts[0]),
      lng: parseFloat(parts[1]),
      display: locationString,
    };
  }
  // Human-readable: last 2 parts as "Area, City"
  const display =
    parts.length >= 2
      ? `${parts[parts.length - 1]}, ${parts[parts.length - 2]}`
      : locationString;
  return { lat: null, lng: null, display };
};

const getEventConfig = (type) => EVENT_CONFIG[type] || EVENT_CONFIG.other;

// ─── Sub-components ───────────────────────────────────────────────────────────

const EventBadge = ({ type }) => {
  const cfg = getEventConfig(type);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

const DeliveryIcon = ({ type }) => {
  const cfg = DELIVERY_CONFIG[type];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span title={cfg.label}>
      <Icon size={11} className={cfg.cls} />
    </span>
  );
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "delivered":
      return <CheckCheck size={13} className="text-blue-400" />;
    case "failed":
      return <AlertCircle size={12} className="text-rose-400" />;
    case "pending":
      return <Clock size={11} className="text-slate-400" />;
    default:
      return <Check size={13} className="text-slate-400" />;
  }
};

// ─── Attachment renderers ─────────────────────────────────────────────────────

const ImageGrid = ({ images, onExpand }) => {
  const count = images.length;
  const gridClass =
    count === 1 ? "grid-cols-1" : count === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div
      className={`grid ${gridClass} gap-1 rounded-xl overflow-hidden isolate`}
    >
      {images.map((file, i) => (
        <div
          key={file.id}
          className={`relative group overflow-hidden bg-slate-100 dark:bg-slate-800 isolate ${
            count === 1 ? "aspect-video max-h-64" : "aspect-square"
          }`}
        >
          <img
            src={file.file_url}
            alt="attachment"
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
            onClick={() => onExpand({ url: file.file_url, caption: "" })}
          />
          <button
            onClick={() => onExpand({ url: file.file_url, caption: "" })}
            className="absolute top-1.5 right-1.5 p-1 bg-black/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={11} className="text-white" />  
          </button>
        </div>
      ))}
    </div>
  );
};

const VideoBlock = ({ file }) => (
  <div className="rounded-xl overflow-hidden bg-black">
    <video controls className="w-full max-h-56 block">
      <source src={file.file_url} type="video/mp4" />
    </video>
  </div>
);

const VoiceBlock = ({ file, isPlaying, onToggle, duration = "0:00" }) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [audioDuration, setAudioDuration] = useState(duration);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Parse original name if needed (for display)
  const getOriginalName = () => {
    try {
      if (file.field_value) {
        const parsed = JSON.parse(file.field_value);
        return parsed.originalName;
      }
    } catch (e) {
      console.error("Failed to parse field_value:", e);
    }
    return null;
  };

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle audio metadata load
  const handleLoadedMetadata = () => {
    if (
      audioRef.current &&
      !isNaN(audioRef.current.duration) &&
      isFinite(audioRef.current.duration)
    ) {
      setAudioDuration(formatTime(audioRef.current.duration));
      setIsLoading(false);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (
      audioRef.current &&
      !isNaN(audioRef.current.currentTime) &&
      audioRef.current.duration
    ) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };

  // Handle audio errors
  const handleError = (e) => {
    // console.error("Audio error:", e);
    setError("Unable to load audio");
    setIsLoading(false);
  };

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || error) return;

    const playAudio = async () => {
      try {
        if (isPlaying) {
          setIsLoading(true);
          await audioRef.current.play();
          setIsLoading(false);
        } else {
          audioRef.current.pause();
        }
      } catch (err) {
        console.error("Playback error:", err);
        setError("Playback failed");
        setIsLoading(false);
        if (onToggle) onToggle(); // Reset playing state
      }
    };

    playAudio();
  }, [isPlaying, error, onToggle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Handle seek
  const handleSeek = (e) => {
    if (!audioRef.current || error) return;

    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickPosition / rect.width));

    if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  // If there's an error, show fallback UI
  if (error) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 min-w-64">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <AlertCircle size={16} className="text-red-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          <a
            href={file.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-red-500 underline mt-1 inline-block"
          >
            Open file directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 min-w-64">
      <audio
        ref={audioRef}
        src={file.file_url}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        className="hidden"
      />

      <button
        onClick={onToggle}
        disabled={isLoading}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isLoading ? "opacity-50 cursor-wait" : ""
        } ${
          isPlaying
            ? "bg-linear-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30"
            : "bg-linear-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} className="text-white" />
        ) : (
          <Play size={16} className="text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-0.5 h-7">
            {[...Array(20)].map((_, i) => {
              const heights = [
                4, 6, 8, 10, 12, 14, 12, 10, 8, 6, 4, 8, 12, 16, 14, 10, 8, 6,
                4, 2,
              ];
              const activeHeights = [
                6, 8, 12, 16, 20, 24, 20, 16, 12, 8, 6, 12, 18, 24, 22, 16, 12,
                8, 6, 4,
              ];
              return (
                <div
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-150 ${
                    isPlaying && !error
                      ? "bg-linear-to-t from-blue-400 to-blue-500"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                  style={{
                    height: `${isPlaying && !error ? activeHeights[i] : heights[i]}px`,
                    animation:
                      isPlaying && !error
                        ? `wave ${0.5 + i * 0.05}s ease-in-out infinite`
                        : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            {currentTime}
          </span>

          <div
            className="relative flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden cursor-pointer group/seek"
            onClick={handleSeek}
          >
            <div
              className="absolute h-full bg-linear-to-r from-blue-500 to-rose-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/seek:opacity-100 transition-opacity duration-200"
              style={{
                left: `${progress}%`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>

          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            {audioDuration}
          </span>
        </div>
      </div>

      <Mic
        size={12}
        className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors duration-200"
      />
    </div>
  );
};

const FileBlock = ({ file }) => {
  const filename = file.file_url?.split("/").pop() || "file";
  const ext = filename.split(".").pop().toUpperCase();
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70">
      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
        <FileText size={15} className="text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
          {filename}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{ext}</p>
      </div>
      <a
        href={file.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
      >
        <MoveDiagonal size={13} />
      </a>
    </div>
  );
};

const LocationBlock = ({ locationString }) => {
  const loc = parseLocation(locationString);
  if (!loc) return null;
  const mapsUrl =
    loc.lat !== null
      ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent(locationString)}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30  dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors group"
    >
      <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0">
        <MapPin size={14} className="text-rose-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
          📍 {loc.display}
        </p>
        <p className="text-[10px] text-rose-500 dark:text-rose-400 mt-0.5 flex items-center gap-1">
          Open in Maps <ExternalLink size={9} />
        </p>
      </div>
    </a>
  );
};

// ─── Attachments renderer (separates images from files) ──────────────────────
const AttachmentsBlock = ({ files, playingVoice, onToggleVoice, onExpand }) => {
  if (!files || files.length === 0) return null;

  const images = files.filter((f) => f.type === "image");
  const videos = files.filter((f) => f.type === "video");
  const voices = files.filter((f) => f.type === "voice");
  // const audios = files.filter((f) => f.type === "audio");
  const others = files.filter(
    (f) =>
      ![
        "image",
        "video",
        "voice",
        //  "audio"
      ].includes(f.type),
  );

  return (
    <div className="space-y-2 mt-2">
      {images.length > 0 && <ImageGrid images={images} onExpand={onExpand} />}
      {videos.map((f) => (
        <VideoBlock key={f.id} file={f} />
      ))}
      {voices.length > 0 && (
        <div className="space-y-1.5">
          {voices.map((f) => (
            <VoiceBlock
              key={f.id}
              file={f}
              isPlaying={playingVoice === f.id}
              onToggle={() => onToggleVoice(f.id, f.file_url)}
            />
          ))}
        </div>
      )}
      {/* {audios.map((f) => (
        <AudioBlock key={f.id} file={f} />
      ))} */}
      {others.map((f) => (
        <FileBlock key={f.id} file={f} />
      ))}
    </div>
  );
};

// ─── Message Card ─────────────────────────────────────────────────────────────
const MessageCard = forwardRef(
  ({ message, playingVoice, onToggleVoice, onExpand }, ref) => {
    const isUser = message.created_by === "current-user-id";
    const cfg = getEventConfig(message.event_type);
    const hasFiles = message.files && message.files.length > 0;
    const hasLocation = !!message.location;
    const hasText = !!message.message;

    return (
      <div
        ref={ref}
        className={`mx-4 mb-3 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${cfg.bg} ${cfg.border}`}
      >
        {/* Card tint strip */}
        <div className={`h-0.5 w-full bg-linear-to-r ${cfg.tint}`} />

        {/* Card header */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            {message.event_type && <EventBadge type={message.event_type} />}
          </div>
          <div className="flex items-center gap-2">
            {message.delivery_type && (
              <DeliveryIcon type={message.delivery_type} />
            )}
            <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
              {formatTime(message.created_at)}
            </span>
          </div>
        </div>

        {/* Sender */}
        {message.sender && (
          <div className="flex items-center gap-2 px-3.5 pb-2">
            {message.avatar ? (
              <img
                src={message.avatar}
                alt={message.sender}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center shrink-0">
                <User size={10} className="text-white" />
              </div>
            )}
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {message.sender}
            </span>
          </div>
        )}

        {/* Body */}
        <div className="px-3.5 pb-3 space-y-2">
          {/* 1. Message text */}
          {hasText && (
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 wrap-break-words">
              {message.message}
            </p>
          )}

          {/* 2. Location */}
          {hasLocation && <LocationBlock locationString={message.location} />}

          {/* 3. Attachments */}
          {hasFiles && (
            <AttachmentsBlock
              files={message.files}
              playingVoice={playingVoice}
              onToggleVoice={onToggleVoice}
              onExpand={onExpand}
            />
          )}
        </div>

        {/* Card footer – status */}
        <div
          className={`flex items-center justify-end gap-1.5 px-3.5 pb-2.5 ${isUser ? "" : "opacity-0 pointer-events-none"}`}
        >
          <StatusIcon status={message.status} />
          <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
            {message.status || "sent"}
          </span>
        </div>
      </div>
    );
  },
);

MessageCard.displayName = "MessageCard";

// ─── Main Page ────────────────────────────────────────────────────────────────
const MessagePage = ({
  url = null,
  communityUuid = null,
  showHeader = true,
  onBack = null,
  showNew = true,
}) => {
  const [expandedImage, setExpandedImage] = useState(null);
  const [playingVoice, setPlayingVoice] = useState(null);
  const [messages, setMessages] = useState([]);
  const [before, setBefore] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const fetchingRef = useRef(false);
  const containerRef = useRef(null);
  const prevHeightRef = useRef(0);
  const audioRefs = useRef({});
  const initialLoadRef = useRef(true);
  const firstMessageRef = useRef(null);
  const lastMessageRef = useRef(null);
  const messagesRef = useRef(messages);
  const unreadNotifications = useSelector(
    (state) => selectUnreadNotifications(state) ?? [],
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!unreadNotifications.length) return;

    setMessages((prev) => {
      const existingUuids = new Set(prev.map((m) => m.uuid));

      const newMessages = unreadNotifications.filter(
        (n) => !existingUuids.has(n.uuid),
      );

      const merged = [...prev, ...newMessages];

      return merged.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    });

    dispatch(markAllAsRead());
  }, [unreadNotifications]);

  useEffect(() => {
    if (initialLoadRef.current) return; // skip — initial scroll handled separately
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    dispatch(markAllAsRead());
  }, []);

  const fetchUrl = useMemo(() => {
    return `${url}?limit=20${before ? `&before=${before}` : ""}`;
  }, [before, url]);

  const { data, loading, error } = useFetchData({
    url: fetchUrl,
    onSuccess: (responseData) => {
      if (!responseData) return;
      const newMessages = responseData.messages || responseData;
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const filtered = newMessages.filter((m) => !existingIds.has(m.id));
        return [...filtered, ...prev].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
      });
      setHasMore(responseData.hasMore ?? newMessages.length === 20);
    },
    onError: (err) => console.error("Error fetching messages:", err),
  });

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!loading && initialLoadRef.current && messages.length > 0) {
      const container = containerRef.current;

      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
          prevHeightRef.current = container.scrollHeight;
          initialLoadRef.current = false;
        }, 50); // small delay fixes DOM timing
      }
    }
  }, [loading, messages.length]);

  useEffect(() => {
    if (!isLoadingMore) return;
    if (!containerRef.current) return;

    const container = containerRef.current;
    const newHeight = container.scrollHeight;

    container.scrollTop += newHeight - prevHeightRef.current;
    prevHeightRef.current = newHeight;
  }, [messages.length]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleScroll = () => {
      if (
        container.scrollTop <= 0 &&
        hasMore &&
        !fetchingRef.current &&
        !initialLoadRef.current &&
        messagesRef.current.length > 0
      ) {
        fetchingRef.current = true;
        setIsLoadingMore(true);
        prevHeightRef.current = container.scrollHeight;

        setBefore(messagesRef.current[0]?.created_at);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, messages.length]); // 👈 important

  useEffect(() => {
    if (!loading && isLoadingMore) {
      setIsLoadingMore(false);
      fetchingRef.current = false;
    }
  }, [loading, isLoadingMore]);

  const handleToggleVoice = (fileId, fileUrl) => {
    if (playingVoice === fileId) {
      audioRefs.current[fileId]?.pause();
      setPlayingVoice(null);
    } else {
      if (playingVoice && audioRefs.current[playingVoice]) {
        audioRefs.current[playingVoice].pause();
      }
      if (!audioRefs.current[fileId]) {
        const audio = new Audio(fileUrl);
        audioRefs.current[fileId] = audio;
        audio.onended = () => {
          setPlayingVoice(null);
          delete audioRefs.current[fileId];
        };
      }
      audioRefs.current[fileId].play();
      setPlayingVoice(fileId);
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  const dateKeys = Object.keys(groupedMessages);
  return (
    <div className="h-screen dark:bg-gray-950 transition-colors duration-300 flex flex-col ">
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-20">
          {/* Glass bar */}
          <div className="bg-white/80 dark:bg-gray-950 backdrop-blur-xl ">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
              {/* Left: back + title */}
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-150">
                  <ChevronLeft
                    size={18}
                    className="text-gray-700 dark:text-gray-300"
                  />
                </button>
                <div>
                  <h1 className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">
                    Messages
                  </h1>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                    & Notifications
                  </p>
                </div>
              </div>

              {/* Right: actions */}
              {showNew && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowNewMessageModal(true)}
                    title="New message"
                    className="
                         group flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer
                         bg-blue-600 hover:bg-blue-700
                         dark:bg-blue-500 dark:hover:bg-blue-600
                         text-white text-[13px] font-medium
                         shadow-sm shadow-blue-600/25
                         transition-all duration-150 active:scale-95
                       "
                  >
                    <Plus
                      size={15}
                      className="transition-transform duration-150 group-hover:rotate-90"
                    />
                    <span className="hidden sm:inline">New</span>
                  </button>

                  <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                    <MoreVertical
                      size={17}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto min-h-0 scrollbar-hide relative z-0"
      >
        <div
          className="w-full max-w-2xl mx-auto py-4 flex flex-col min-h-full"
          id="message-container"
        >
          {/* Load more spinner */}
          {(isLoadingMore || loading) && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 size={14} className="animate-spin" />
                <span>Loading…</span>
              </div>
            </div>
          )}

          {/* Start of history */}
          {!hasMore && messages.length > 0 && (
            <div className="flex items-center gap-3 px-8 my-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                Start of Notifications
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>
          )}

          {dateKeys.map((date, dateIdx) => {
            const dateMessages = groupedMessages[date];

            return (
              <div key={date}>
                {/* Date pill */}
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium uppercase tracking-wider rounded-full shadow-sm ring-1 ring-slate-900/5 dark:ring-white/5">
                    {date}
                  </span>
                </div>

                {dateMessages.map((message, index) => {
                  const isFirst = index === 0;
                  const isLast =
                    dateIdx === dateKeys.length - 1 &&
                    index === dateMessages.length - 1;
                  return (
                    <MessageCard
                      key={message.uuid}
                      message={message}
                      ref={
                        isFirst
                          ? firstMessageRef
                          : isLast
                            ? lastMessageRef
                            : null
                      }
                      playingVoice={playingVoice}
                      onToggleVoice={handleToggleVoice}
                      onExpand={setExpandedImage}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Empty state */}
          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/5">
                <Send size={20} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                No messages yet
              </h3>
              <p className="text-xs text-slate-400 max-w-48 leading-relaxed">
                Messages sent to this community will appear here
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Image lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
          <img
            src={expandedImage.url}
            alt={expandedImage.caption}
            className="max-w-full max-h-[88vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {expandedImage.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 px-4 py-2 rounded-full">
              {expandedImage.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagePage;
