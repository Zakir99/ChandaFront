import { useState, useEffect } from "react";
import { Users, Wallet, BookOpen, Heart } from "lucide-react";

function AnimatedNumber({ value, duration = 1100 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(String(value), 10);
    if (isNaN(end)) { setDisplay(value); return; }
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{typeof display === "number" ? display.toLocaleString() : display}</>;
}

function ThinBar({ pct, colorClass }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 100); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="w-full h-0.5 rounded-full mt-2.5 overflow-hidden bg-black/8 dark:bg-white/5">
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function DataRow({ label, value, dimValue }) {
  return (
    <div className="flex items-center justify-between mt-1.5">
      <span className="text-[11px] text-slate-400 dark:text-white/30">{label}</span>
      <span className={`text-[11px] font-semibold ${dimValue
        ? "text-slate-300 dark:text-white/25"
        : "text-slate-500 dark:text-white/50"
      }`}>{value}</span>
    </div>
  );
}

function Badge({ children, lightClass, darkClass }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${lightClass} ${darkClass}`}>
      {children}
    </span>
  );
}

function IconBox({ icon: Icon, lightColor, darkColor, lightBg, darkBg, lightBorder, darkBorder }) {
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
      ${lightBg} ${lightBorder}
      ${darkBg} ${darkBorder}`}>
      <Icon size={14} className={`${lightColor} ${darkColor}`} strokeWidth={2.2} />
    </div>
  );
}

function StatCard({ children, delay = 0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-4
        bg-white  shadow-sm
        hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md
        dark:bg-white/3 dark:border-white/[0.07] dark:shadow-none
        dark:hover:bg-white/5 dark:hover:border-white/12 dark:hover:shadow-2xl
        transition-all duration-300 ease-out
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
      style={{ transition: "opacity 0.45s ease, transform 0.45s ease, background 0.25s, border-color 0.25s, box-shadow 0.25s" }}
    >
      {children}
    </div>
  );
}

export default function StatCards({ data, theme = "light" }) {
  const { activeFamilies, account, monthly, deathSupports } = data;
  const monthlyPct = Math.round((monthly.collected / monthly.expected) * 100) || 0;
  const deathPct = Math.round((deathSupports.paid / deathSupports.total) * 100) || 0;

  // if (!activeFamilies || !account || !monthly || !deathSupports) return null;

  return (
    // Add class="dark" here (or on <html>) to enable dark mode
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className=" dark:bg-[#080b12] flex items-center justify-center transition-colors duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="w-full">

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-0.5 h-4 rounded-full bg-slate-300 dark:bg-white/20" />
            <div className="flex-1 h-px bg-linear-to-r from-slate-200 to-transparent dark:from-white/6 dark:to-transparent" />
            <span
              className="text-[10px] text-slate-400 dark:text-white/18 tracking-wide"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">

            {/* Active Families */}
            <StatCard delay={0}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-violet-400/8 dark:bg-violet-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox
                  icon={Users}
                  lightColor="text-violet-600" darkColor="dark:text-violet-400"
                  lightBg="bg-violet-50" darkBg="dark:bg-violet-500/10"
                  lightBorder="border-violet-200" darkBorder="dark:border-violet-500/20"
                />
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 tracking-[0.08em] uppercase mb-1">
                Active Families
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-none tracking-tight"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <AnimatedNumber value={activeFamilies} />
                </span>
                <Badge
                  lightClass="text-violet-600 bg-violet-50 border-violet-200"
                  darkClass="dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20"
                >
                  Members
                </Badge>
              </div>
              <div className="h-px bg-slate-100 dark:bg-white/5 my-2.5" />
              <DataRow label="Registration status" value="All active" />
            </StatCard>

            {/* Account Balance */}
            <StatCard delay={110}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-400/8 dark:bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox
                  icon={Wallet}
                  lightColor="text-emerald-600" darkColor="dark:text-emerald-400"
                  lightBg="bg-emerald-50" darkBg="dark:bg-emerald-500/10"
                  lightBorder="border-emerald-200" darkBorder="dark:border-emerald-500/20"
                />
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 tracking-[0.08em] uppercase mb-1">
                Account Balance
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-none tracking-tight"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <AnimatedNumber value={account.balance} />
                </span>
                <Badge
                  lightClass="text-emerald-600 bg-emerald-50 border-emerald-200"
                  darkClass="dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                >
                  SAR
                </Badge>
              </div>
              <ThinBar pct={100} colorClass="bg-emerald-500" />
              <div className="h-px bg-slate-100 dark:bg-white/5 my-2.5" />
              <DataRow label="From registers" value={account?.collected_from_registers?.toLocaleString() || 0} />
              <DataRow label="External supports" value={account?.given_for_external_supports?.toLocaleString() || 0} dimValue />
            </StatCard>

            {/* Monthly Collection */}
            <StatCard delay={220}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-sky-400/8 dark:bg-sky-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox
                  icon={BookOpen}
                  lightColor="text-sky-600" darkColor="dark:text-sky-400"
                  lightBg="bg-sky-50" darkBg="dark:bg-sky-500/10"
                  lightBorder="border-sky-200" darkBorder="dark:border-sky-500/20"
                />
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 tracking-[0.08em] uppercase mb-1">
                Monthly Collection
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-none tracking-tight"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <AnimatedNumber value={monthly.collected} />
                </span>
                <Badge
                  lightClass="text-sky-600 bg-sky-50 border-sky-200"
                  darkClass="dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20"
                >
                  {monthlyPct}%
                </Badge>
              </div>
              <ThinBar pct={monthlyPct} colorClass="bg-sky-500" />
              <div className="h-px bg-slate-100 dark:bg-white/5 my-2.5" />
              <DataRow label="Expected" value={monthly?.expected?.toLocaleString()|| 0} />
              <DataRow label="Unpaid" value={monthly?.unpaid?.toLocaleString()|| 0} />
            </StatCard>

            {/* Death Supports */}
            <StatCard delay={330}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-rose-400/8 dark:bg-rose-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox
                  icon={Heart}
                  lightColor="text-rose-600" darkColor="dark:text-rose-400"
                  lightBg="bg-rose-50" darkBg="dark:bg-rose-500/10"
                  lightBorder="border-rose-200" darkBorder="dark:border-rose-500/20"
                />
                <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5
                  text-rose-600 bg-rose-50 border-rose-200
                  dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20">
                  {deathPct}% paid
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 tracking-[0.08em] uppercase mb-1">
                Death Supports
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-none tracking-tight"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <AnimatedNumber value={deathSupports.total} />
                </span>
                <Badge
                  lightClass="text-rose-600 bg-rose-50 border-rose-200"
                  darkClass="dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20"
                >
                  Cases
                </Badge>
              </div>
              <ThinBar pct={deathPct} colorClass="bg-rose-500" />
              <div className="h-px bg-slate-100 dark:bg-white/5 my-2.5" />
              <DataRow label="Local / External" value={`${deathSupports.local_total} / ${deathSupports.external_total}`} />
              <DataRow label="Given for local" value={deathSupports?.given_for_local?.toLocaleString()|| 0} />
              <DataRow label="Unpaid cases" value={deathSupports.unpaid} />
            </StatCard>

          </div>
        </div>
      </div>
    </div>
  );
}