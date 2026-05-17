import {
  DollarSign, TrendingUp, Users, Clock, AlertTriangle,
  Activity, CheckCircle, XCircle, Heart, Download,
  CreditCard, UserPlus, Home, ChevronRight, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', collected: 5200, externalPaid: 1200 },
  { month: 'Feb', collected: 4800, externalPaid: 800 },
  { month: 'Mar', collected: 6100, externalPaid: 2000 },
  { month: 'Apr', collected: 5500, externalPaid: 1500 },
  { month: 'May', collected: 5800, externalPaid: 1800 },
  { month: 'Jun', collected: 5300, externalPaid: 1300 },
  { month: 'Jul', collected: 6200, externalPaid: 2100 },
  { month: 'Aug', collected: 4700, externalPaid: 900 },
  { month: 'Sep', collected: 5100, externalPaid: 1100 },
  { month: 'Oct', collected: 5900, externalPaid: 1700 },
  { month: 'Nov', collected: 5400, externalPaid: 1400 },
  { month: 'Dec', collected: 5600, externalPaid: 1600 },
];

const recentActivities = [
  { id: 1, type: 'death_support', description: 'External death support — John Doe', amount: 5000, date: 'Jan 15, 2024', status: 'paid' },
  { id: 2, type: 'monthly_payment', description: 'Monthly contribution — Family Smith', amount: 200, date: 'Jan 14, 2024', status: 'paid' },
  { id: 3, type: 'new_family', description: 'New family registered — Johnson Family', amount: null, date: 'Jan 13, 2024', status: 'active' },
  { id: 4, type: 'death_support', description: 'Local death support — Maria Garcia', amount: 3000, date: 'Jan 12, 2024', status: 'pending' },
  { id: 5, type: 'monthly_payment', description: 'Monthly contribution — Family Brown', amount: 200, date: 'Jan 11, 2024', status: 'paid' },
  { id: 6, type: 'death_support', description: 'External death support — Robert Wilson', amount: 4500, date: 'Jan 10, 2024', status: 'unpaid' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 rounded-xl p-4 shadow-xl">
        <p className="text-gray-400 dark:text-gray-500 text-xs mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold mt-1" style={{ color: entry.color }}>
            {entry.name}: <span className="text-gray-200 dark:text-gray-300">${entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatusBadge = ({ status }) => {
  const config = {
    paid:    { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: <CheckCircle size={11} />, label: 'Paid' },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: <Clock size={11} />, label: 'Pending' },
    unpaid:  { bg: 'bg-red-500/10', text: 'text-red-500', icon: <XCircle size={11} />, label: 'Unpaid' },
    active:  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', icon: <Zap size={11} />, label: 'Active' },
  };
  const c = config[status] || config.active;
  
  return (
    <span className={`inline-flex items-center gap-1 ${c.bg} ${c.text} px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide`}>
      {c.icon} {c.label}
    </span>
  );
};

const ActivityIcon = ({ type }) => {
  const map = {
    death_support:   { bg: 'bg-purple-500/15', text: 'text-purple-400', icon: <Heart size={14} /> },
    monthly_payment: { bg: 'bg-blue-500/15', text: 'text-blue-400', icon: <CreditCard size={14} /> },
    new_family:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: <UserPlus size={14} /> },
  };
  const c = map[type] || map.monthly_payment;
  
  return (
    <div className={`${c.bg} ${c.text} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
      {c.icon}
    </div>
  );
};

const KpiCard = ({ label, sublabel, value, icon, accent, prefix = '$' }) => (
  <div className="relative bg-linear-to-br from-gray-900 to-gray-950 dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-gray-700 border-t-2 rounded-xl p-6 overflow-hidden" style={{ borderTopColor: accent }}>
    <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-10" style={{ background: accent }} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">{label}</p>
        <p className="text-gray-100 dark:text-gray-100 text-2xl font-bold leading-none">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {sublabel && <p className="text-gray-500 dark:text-gray-600 text-xs mt-1.5">{sublabel}</p>}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}>
        {icon}
      </div>
    </div>
  </div>
);

const RiskCard = ({ label, sublabel, value, icon, accent, badge }) => (
  <div className="bg-linear-to-br from-gray-900 to-gray-950 dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-gray-700 border-l-4 rounded-xl p-6">
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wide mb-1.5">{label}</p>
        <p className="text-gray-100 dark:text-gray-100 text-3xl font-bold">{value}</p>
        <p className="text-gray-500 dark:text-gray-600 text-xs mt-1">{sublabel}</p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
        {icon}
      </div>
    </div>
    <div className="p-2.5 rounded-lg text-xs font-medium" style={{ background: `${accent}10`, border: `1px solid ${accent}25`, color: accent }}>
      {badge}
    </div>
  </div>
);

export default function Dashboard() {
  const compliance = 82;
  const totalFamilies = 45;
  const paidFamilies = Math.round(totalFamilies * compliance / 100);

  return (
    <div className="min-h-screen bg-gray-900/90 dark:bg-gray-900 text-gray-200 font-sans p-8">
      {/* Ambient background glow */}
      <div className="fixed -top-48 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full bg-linear-to-b from-sky-500/5 to-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-9">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-sky-400 to-indigo-400 flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100 tracking-tight">
                FAMILY FUND
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-600 text-xs tracking-wide">
              Financial Operations Dashboard · FY 2024
            </p>
          </div>
          <button className="flex items-center gap-2 bg-linear-to-br from-sky-400 to-blue-600 border-none rounded-lg px-5 py-2.5 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all">
            <Download size={15} />
            Export Report
          </button>
        </div>

        {/* ── Section: Financial Summary ── */}
        <div className="mb-2">
          <p className="text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3.5 ml-0.5">
            ◆ Financial Summary
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard label="Monthly Collected" sublabel="Current Year Total" value={45600} icon={<TrendingUp size={20} />} accent="#38bdf8" />
          <KpiCard label="External Paid" sublabel="Death support payouts" value={12300} icon={<Heart size={20} />} accent="#a78bfa" />
          <KpiCard label="Available Balance" sublabel="Usable fund reserve" value={33300} icon={<DollarSign size={20} />} accent="#34d399" />
          <KpiCard label="Local Collections" sublabel="Direct contributions" value={25600} icon={<Users size={20} />} accent="#fb923c" />
        </div>

        {/* ── Section: Risk ── */}
        <div className="mb-2">
          <p className="text-amber-500 text-xs font-semibold tracking-widest uppercase mb-3.5 ml-0.5">
            ◆ Pending & Risk Indicators
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <RiskCard label="Unpaid Monthly" sublabel="Families with overdue contributions" value={8} icon={<Clock size={22} />} accent="#f59e0b" badge="⚠ 8 pending contributions this cycle" />
          <RiskCard label="Pending Local" sublabel="Unresolved local death cases" value={4} icon={<XCircle size={22} />} accent="#fb923c" badge="⏳ 4 local payments awaiting processing" />
          <RiskCard label="Unpaid External" sublabel="Outstanding external cases" value={2} icon={<AlertTriangle size={22} />} accent="#ef4444" badge="🔴 2 cases require immediate action" />
        </div>

        {/* ── Section: Activity Overview ── */}
        <div className="mb-2">
          <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3.5 ml-0.5">
            ◆ Activity Overview
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Families', value: 45, icon: <Home size={20} />, accent: '#818cf8', sublabel: 'Registered & contributing' },
            { label: 'Local Deaths', value: 6, icon: <Heart size={20} />, accent: '#f472b6', sublabel: 'This year' },
            { label: 'External Deaths', value: 4, icon: <TrendingUp size={20} />, accent: '#34d399', sublabel: 'This year' },
          ].map((item, i) => (
            <KpiCard key={i} label={item.label} sublabel={item.sublabel} value={item.value} icon={item.icon} accent={item.accent} prefix="" />
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-7">
          {/* Area Chart */}
          <div className="bg-linear-to-br from-gray-900 to-gray-950 dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-gray-100 dark:text-gray-100 text-sm font-semibold">Collections vs Payouts</h3>
                <p className="text-gray-500 dark:text-gray-600 text-xs mt-1">Monthly breakdown for FY 2024</p>
              </div>
              <div className="flex gap-4">
                {[['#38bdf8', 'Collected'], ['#a78bfa', 'External Paid']].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-gray-500 dark:text-gray-600 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-55">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExternal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#4b5565', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4b5565', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="#38bdf8" strokeWidth={2} fill="url(#gradCollected)" dot={false} activeDot={{ r: 4, fill: '#38bdf8', stroke: '#0b0f18', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="externalPaid" name="External Paid" stroke="#a78bfa" strokeWidth={2} fill="url(#gradExternal)" dot={false} activeDot={{ r: 4, fill: '#a78bfa', stroke: '#0b0f18', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Panel */}
          <div className="bg-linear-to-br from-gray-900 to-gray-950 dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-gray-700 rounded-xl p-6 flex flex-col">
            <h3 className="text-gray-100 dark:text-gray-100 text-sm font-semibold mb-1.5">Payment Compliance</h3>
            <p className="text-gray-500 dark:text-gray-600 text-xs mb-7">Family contribution rate</p>

            {/* Circular gauge */}
            <div className="flex justify-center mb-7">
              <div className="relative w-35 h-35">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="58" fill="none" stroke="#1f2937" strokeWidth="10" />
                  <circle
                    cx="70" cy="70" r="58" fill="none"
                    stroke="url(#complianceGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 58}`}
                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - compliance / 100)}`}
                    transform="rotate(-90 70 70)"
                  />
                  <defs>
                    <linearGradient id="complianceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-gray-100 leading-none">{compliance}%</span>
                  <span className="text-[10px] text-gray-500 mt-1 tracking-wide">COMPLIANT</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-emerald-400 text-xs font-medium text-center mb-4">
              ✅ Healthy compliance rate
            </div>

            <div className="mt-auto">
              {[
                { label: 'Families Paid', value: paidFamilies, max: totalFamilies, color: '#34d399' },
                { label: 'Outstanding', value: totalFamilies - paidFamilies, max: totalFamilies, color: '#ef4444' },
              ].map(({ label, value, max, color }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500 dark:text-gray-600 text-xs">{label}</span>
                    <span className="text-xs font-semibold" style={{ color }}>{value} / {max}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 dark:bg-gray-700 rounded-full">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(value / max) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-linear-to-br from-gray-900 to-gray-950 dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-gray-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-gray-100 dark:text-gray-100 text-sm font-semibold">Recent Transactions</h3>
              <p className="text-gray-500 dark:text-gray-600 text-xs mt-1">Latest activity across all accounts</p>
            </div>
            <button className="flex items-center gap-1 bg-transparent border border-gray-800 dark:border-gray-700 rounded-lg px-3.5 py-1.5 text-sky-400 text-xs font-medium hover:bg-gray-800/50 transition-colors">
              View All <ChevronRight size={13} />
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[44px_1fr_120px_130px_90px] gap-3 px-3 py-2 border-b border-gray-800 dark:border-gray-700 mb-1">
            {['', 'Description', 'Amount', 'Date', 'Status'].map((h, i) => (
              <span key={i} className="text-gray-500 dark:text-gray-600 text-[10px] font-semibold uppercase tracking-wider">{h}</span>
            ))}
          </div>

          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="grid grid-cols-[44px_1fr_120px_130px_90px] gap-3 px-3 py-3.5 items-center border-b border-gray-900 dark:border-gray-800 last:border-0 rounded-lg hover:bg-gray-900/50 dark:hover:bg-gray-800/50 transition-colors cursor-default"
            >
              <ActivityIcon type={activity.type} />
              <div>
                <p className="text-gray-200 dark:text-gray-300 text-sm font-medium">{activity.description}</p>
                <p className="text-gray-500 dark:text-gray-600 text-xs mt-0.5 capitalize">
                  {activity.type.replace(/_/g, ' ')}
                </p>
              </div>
              <span className={`text-sm ${activity.amount ? 'text-gray-100 font-semibold' : 'text-gray-500'}`}>
                {activity.amount ? `$${activity.amount.toLocaleString()}` : '—'}
              </span>
              <span className="text-gray-500 dark:text-gray-600 text-xs">{activity.date}</span>
              <StatusBadge status={activity.status} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-800 dark:text-gray-800 text-xs">Family Fund Management System · Data refreshed in real-time</p>
        </div>
      </div>
    </div>
  );
}