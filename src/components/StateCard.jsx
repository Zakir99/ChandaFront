import { useState, useEffect } from "react";
import { Users, Wallet, BookOpen, Heart, TrendingUp } from "lucide-react";


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
    <div className="w-full h-0.5 rounded-full bg-white/5 mt-2.5 overflow-hidden">
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
      <span className="text-[11px] text-white/30">{label}</span>
      <span className={`text-[11px] font-semibold ${dimValue ? "text-white/25" : "text-white/50"}`}>{value}</span>
    </div>
  );
}

function Badge({ children, colorClass }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${colorClass}`}>
      {children}
    </span>
  );
}

function IconBox({ icon: Icon, colorClass, bgClass, borderClass }) {
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgClass} ${borderClass} border`}>
      <Icon size={14} className={colorClass} strokeWidth={2.2} />
    </div>
  );
}

function StatCard({ children, delay = 0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-4
      bg-white/3 border border-white/[0.07]
      hover:bg-white/5.5 hover:border-white/3
      hover:-translate-y-0.5 hover:shadow-2xl
      transition-all duration-300 ease-out
      ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
    `}
      style={{ transition: "opacity 0.45s ease, transform 0.45s ease, background 0.25s, border-color 0.25s, box-shadow 0.25s" }}
    >
      {children}
    </div>
  );
}

export default function StatCards({data}) {
  const { activeFamilies, account, monthly, deathSupports } = data;
  const monthlyPct = Math.round((monthly.collected / monthly.expected) * 100);
  const deathPct = Math.round((deathSupports.paid / deathSupports.total) * 100);

  if(!activeFamilies || !account || !monthly || !deathSupports) return null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className=" bg-[#080b12] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full">

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-0.5 h-4 rounded-full bg-white/20" />
            {/* <span className="text-[10px] font-medium text-white/25 tracking-[0.12em] uppercase">Dashboard Overview</span> */}
            <div className="flex-1 h-px bg-linear-to-r from-white/6 to-transparent" />
            <span className="text-[10px] text-white/18 tracking-wide" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">

            {/* Active Families */}
            <StatCard delay={0}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox icon={Users} colorClass="text-violet-400" bgClass="bg-violet-500/10" borderClass="border-violet-500/20" />
              </div>
              <p className="text-[10px] font-medium text-white/30 tracking-[0.08em] uppercase mb-1">Active Families</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-100 leading-none tracking-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  <AnimatedNumber value={activeFamilies} />
                </span>
                <Badge colorClass="text-violet-400 bg-violet-500/10 border-violet-500/20">Members</Badge>
              </div>
              <div className="h-px bg-white/5 my-2.5" />
              <DataRow label="Registration status" value="All active" />
            </StatCard>

            {/* Account Balance */}
            <StatCard delay={110}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox icon={Wallet} colorClass="text-emerald-400" bgClass="bg-emerald-500/10" borderClass="border-emerald-500/20" />
              </div>
              <p className="text-[10px] font-medium text-white/30 tracking-[0.08em] uppercase mb-1">Account Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-100 leading-none tracking-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  <AnimatedNumber value={account.balance} />
                </span>
                <Badge colorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20">SAR</Badge>
              </div>
              <ThinBar pct={100} colorClass="bg-emerald-500" />
              <div className="h-px bg-white/5 my-2.5" />
              <DataRow label="From registers" value={account.collected_from_registers.toLocaleString()} />
              <DataRow label="External supports" value={account.given_for_external_supports.toLocaleString()} dimValue />
            </StatCard>

            {/* Monthly Collection */}
            <StatCard delay={220}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox icon={BookOpen} colorClass="text-sky-400" bgClass="bg-sky-500/10" borderClass="border-sky-500/20" />
              </div>
              <p className="text-[10px] font-medium text-white/30 tracking-[0.08em] uppercase mb-1">Monthly Collection</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-100 leading-none tracking-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  <AnimatedNumber value={monthly.collected} />
                </span>
                <Badge colorClass="text-sky-400 bg-sky-500/10 border-sky-500/20">{monthlyPct}%</Badge>
              </div>
              <ThinBar pct={monthlyPct} colorClass="bg-sky-500" />
              <div className="h-px bg-white/5 my-2.5" />
              <DataRow label="Expected" value={monthly.expected.toLocaleString()} />
              <DataRow label="Unpaid" value={monthly.unpaid.toLocaleString()} />
            </StatCard>

            {/* Death Supports */}
            <StatCard delay={330}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <IconBox icon={Heart} colorClass="text-rose-400" bgClass="bg-rose-500/10" borderClass="border-rose-500/20" />
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-1.5 py-0.5">
                  {deathPct}% paid
                </span>
              </div>
              <p className="text-[10px] font-medium text-white/30 tracking-[0.08em] uppercase mb-1">Death Supports</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-slate-100 leading-none tracking-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  <AnimatedNumber value={deathSupports.total} />
                </span>
                <Badge colorClass="text-rose-400 bg-rose-500/10 border-rose-500/20">Cases</Badge>
              </div>
              <ThinBar pct={deathPct} colorClass="bg-rose-500" />
              <div className="h-px bg-white/5 my-2.5" />
              <DataRow label="Local / External" value={`${deathSupports.local_total} / ${deathSupports.external_total}`} />
              <DataRow label="Given for local" value={deathSupports.given_for_local.toLocaleString()} />
              <DataRow label="Unpaid cases" value={deathSupports.unpaid} />
            </StatCard>

          </div>
        </div>
      </div>
    </>
  );
}