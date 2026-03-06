import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Users, Clock, AlertTriangle,
  Activity, CheckCircle, XCircle, Heart, Download,
  CreditCard, UserPlus, Home, ChevronRight, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';

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
      <div style={{
        background: '#1a1f2e',
        border: '1px solid #2a3040',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <p style={{ color: '#7b8db0', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, fontSize: '13px', fontWeight: 600, margin: '3px 0' }}>
            {entry.name}: <span style={{ color: '#e2e8f0' }}>${entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatusBadge = ({ status }) => {
  const config = {
    paid:    { bg: 'rgba(16,185,129,0.12)', text: '#10b981', icon: <CheckCircle size={11} />, label: 'Paid' },
    pending: { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b', icon: <Clock size={11} />,       label: 'Pending' },
    unpaid:  { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444', icon: <XCircle size={11} />,     label: 'Unpaid' },
    active:  { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8', icon: <Zap size={11} />,          label: 'Active' },
  };
  const c = config[status] || config.active;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: c.bg, color: c.text,
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px'
    }}>
      {c.icon} {c.label}
    </span>
  );
};

const ActivityIcon = ({ type }) => {
  const map = {
    death_support:   { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', icon: <Heart size={14} /> },
    monthly_payment: { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', icon: <CreditCard size={14} /> },
    new_family:      { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', icon: <UserPlus size={14} /> },
  };
  const c = map[type] || map.monthly_payment;
  return (
    <div style={{
      background: c.bg, color: c.color,
      width: 32, height: 32, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      {c.icon}
    </div>
  );
};

const KpiCard = ({ label, sublabel, value, icon, accent, prefix = '$' }) => (
  <div style={{
    background: 'linear-gradient(135deg, #141922 0%, #0f1318 100%)',
    border: `1px solid #1e2535`,
    borderTop: `2px solid ${accent}`,
    borderRadius: 14,
    padding: '22px 24px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: -20, right: -20,
      width: 100, height: 100, borderRadius: '50%',
      background: `${accent}10`
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#5a6a8a', fontSize: 12, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
        <p style={{ color: '#f0f4ff', fontSize: 26, fontWeight: 700, lineHeight: 1, margin: 0 }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {sublabel && <p style={{ color: '#3d4e6a', fontSize: 11, marginTop: 6 }}>{sublabel}</p>}
      </div>
      <div style={{
        background: `${accent}18`, color: accent,
        width: 44, height: 44, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {icon}
      </div>
    </div>
  </div>
);

const RiskCard = ({ label, sublabel, value, icon, accent, badge }) => (
  <div style={{
    background: 'linear-gradient(135deg, #141922 0%, #0f1318 100%)',
    border: `1px solid #1e2535`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: 14,
    padding: '22px 24px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div>
        <p style={{ color: '#5a6a8a', fontSize: 12, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
        <p style={{ color: '#f0f4ff', fontSize: 32, fontWeight: 700, margin: 0 }}>{value}</p>
        <p style={{ color: '#3d4e6a', fontSize: 11, marginTop: 4 }}>{sublabel}</p>
      </div>
      <div style={{
        background: `${accent}15`, color: accent,
        width: 48, height: 48, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {icon}
      </div>
    </div>
    <div style={{
      background: `${accent}10`, border: `1px solid ${accent}25`,
      borderRadius: 8, padding: '8px 12px',
      color: accent, fontSize: 12, fontWeight: 500
    }}>
      {badge}
    </div>
  </div>
);

export default function Dashboard() {
  const compliance = 82;
  const totalFamilies = 45;
  const paidFamilies = Math.round(totalFamilies * compliance / 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0f18',
      color: '#e2e8f0',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: '32px',
    }}>

      {/* Ambient background glow */}
      <div style={{
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Activity size={18} color="#fff" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f4ff', margin: 0, letterSpacing: '-0.3px' }}>
                FAMILY FUND
              </h1>
            </div>
            <p style={{ color: '#3d4e6a', fontSize: 13, margin: 0, letterSpacing: '0.3px' }}>
              Financial Operations Dashboard · FY 2024
            </p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
            border: 'none', borderRadius: 10,
            padding: '10px 20px', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(56,189,248,0.25)'
          }}>
            <Download size={15} />
            Export Report
          </button>
        </div>

        {/* ── Section: Financial Summary ── */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: '#38bdf8', fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px 2px' }}>
            ◆ Financial Summary
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <KpiCard label="Monthly Collected" sublabel="Current Year Total" value={45600} icon={<TrendingUp size={20} />} accent="#38bdf8" />
          <KpiCard label="External Paid" sublabel="Death support payouts" value={12300} icon={<Heart size={20} />} accent="#a78bfa" />
          <KpiCard label="Available Balance" sublabel="Usable fund reserve" value={33300} icon={<DollarSign size={20} />} accent="#34d399" />
          <KpiCard label="Local Collections" sublabel="Direct contributions" value={25600} icon={<Users size={20} />} accent="#fb923c" />
        </div>

        {/* ── Section: Risk ── */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: '#f59e0b', fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px 2px' }}>
            ◆ Pending & Risk Indicators
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          <RiskCard label="Unpaid Monthly" sublabel="Families with overdue contributions" value={8} icon={<Clock size={22} />} accent="#f59e0b" badge="⚠ 8 pending contributions this cycle" />
          <RiskCard label="Pending Local" sublabel="Unresolved local death cases" value={4} icon={<XCircle size={22} />} accent="#fb923c" badge="⏳ 4 local payments awaiting processing" />
          <RiskCard label="Unpaid External" sublabel="Outstanding external cases" value={2} icon={<AlertTriangle size={22} />} accent="#ef4444" badge="🔴 2 cases require immediate action" />
        </div>

        {/* ── Section: Activity Overview ── */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: '#818cf8', fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px 2px' }}>
            ◆ Activity Overview
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Active Families', value: 45, icon: <Home size={20} />, accent: '#818cf8', sublabel: 'Registered & contributing' },
            { label: 'Local Deaths', value: 6, icon: <Heart size={20} />, accent: '#f472b6', sublabel: 'This year' },
            { label: 'External Deaths', value: 4, icon: <TrendingUp size={20} />, accent: '#34d399', sublabel: 'This year' },
          ].map((item, i) => (
            <KpiCard key={i} label={item.label} sublabel={item.sublabel} value={item.value} icon={item.icon} accent={item.accent} prefix="" />
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 28 }}>

          {/* Area Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #141922 0%, #0f1318 100%)',
            border: '1px solid #1e2535',
            borderRadius: 14, padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ color: '#f0f4ff', fontSize: 15, fontWeight: 600, margin: 0 }}>Collections vs Payouts</h3>
                <p style={{ color: '#3d4e6a', fontSize: 12, margin: '4px 0 0' }}>Monthly breakdown for FY 2024</p>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[['#38bdf8', 'Collected'], ['#a78bfa', 'External Paid']].map(([color, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ color: '#5a6a8a', fontSize: 11 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2235" />
                <XAxis dataKey="month" tick={{ fill: '#3d4e6a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#3d4e6a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="collected" name="Collected" stroke="#38bdf8" strokeWidth={2} fill="url(#gradCollected)" dot={false} activeDot={{ r: 4, fill: '#38bdf8', stroke: '#0b0f18', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="externalPaid" name="External Paid" stroke="#a78bfa" strokeWidth={2} fill="url(#gradExternal)" dot={false} activeDot={{ r: 4, fill: '#a78bfa', stroke: '#0b0f18', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Panel */}
          <div style={{
            background: 'linear-gradient(135deg, #141922 0%, #0f1318 100%)',
            border: '1px solid #1e2535',
            borderRadius: 14, padding: '24px',
            display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ color: '#f0f4ff', fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>Payment Compliance</h3>
            <p style={{ color: '#3d4e6a', fontSize: 12, margin: '0 0 28px' }}>Family contribution rate</p>

            {/* Circular gauge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ position: 'relative', width: 140, height: 140 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="58" fill="none" stroke="#1a2235" strokeWidth="10" />
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
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#f0f4ff', lineHeight: 1 }}>{compliance}%</span>
                  <span style={{ fontSize: 10, color: '#3d4e6a', marginTop: 4, letterSpacing: '0.5px' }}>COMPLIANT</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: 10, padding: '10px 14px',
              color: '#34d399', fontSize: 12, fontWeight: 500,
              textAlign: 'center', marginBottom: 16
            }}>
              ✅ Healthy compliance rate
            </div>

            <div style={{ marginTop: 'auto' }}>
              {[
                { label: 'Families Paid', value: paidFamilies, max: totalFamilies, color: '#34d399' },
                { label: 'Outstanding', value: totalFamilies - paidFamilies, max: totalFamilies, color: '#ef4444' },
              ].map(({ label, value, max, color }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: '#5a6a8a', fontSize: 11 }}>{label}</span>
                    <span style={{ color: color, fontSize: 11, fontWeight: 600 }}>{value} / {max}</span>
                  </div>
                  <div style={{ height: 5, background: '#1a2235', borderRadius: 10 }}>
                    <div style={{
                      height: '100%', background: color, borderRadius: 10,
                      width: `${(value / max) * 100}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div style={{
          background: 'linear-gradient(135deg, #141922 0%, #0f1318 100%)',
          border: '1px solid #1e2535',
          borderRadius: 14, padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ color: '#f0f4ff', fontSize: 15, fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
              <p style={{ color: '#3d4e6a', fontSize: 12, margin: '4px 0 0' }}>Latest activity across all accounts</p>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: '1px solid #1e2535',
              borderRadius: 8, padding: '6px 14px',
              color: '#38bdf8', fontSize: 12, fontWeight: 500, cursor: 'pointer'
            }}>
              View All <ChevronRight size={13} />
            </button>
          </div>

          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 120px 130px 90px',
            gap: 12, padding: '8px 12px',
            borderBottom: '1px solid #1a2235', marginBottom: 4
          }}>
            {['', 'Description', 'Amount', 'Date', 'Status'].map((h, i) => (
              <span key={i} style={{ color: '#3d4e6a', fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>

          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 120px 130px 90px',
                gap: 12, padding: '14px 12px',
                borderBottom: index < recentActivities.length - 1 ? '1px solid #111827' : 'none',
                alignItems: 'center',
                transition: 'background 0.15s',
                borderRadius: 8,
                cursor: 'default'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#0f1318'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ActivityIcon type={activity.type} />
              <div>
                <p style={{ color: '#c8d5f0', fontSize: 13, fontWeight: 500, margin: 0 }}>{activity.description}</p>
                <p style={{ color: '#3d4e6a', fontSize: 11, margin: '2px 0 0', textTransform: 'capitalize' }}>
                  {activity.type.replace(/_/g, ' ')}
                </p>
              </div>
              <span style={{ color: activity.amount ? '#f0f4ff' : '#3d4e6a', fontSize: 13, fontWeight: activity.amount ? 600 : 400 }}>
                {activity.amount ? `$${activity.amount.toLocaleString()}` : '—'}
              </span>
              <span style={{ color: '#3d4e6a', fontSize: 12 }}>{activity.date}</span>
              <StatusBadge status={activity.status} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: '#1e2535', fontSize: 11 }}>Family Fund Management System · Data refreshed in real-time</p>
        </div>

      </div>
    </div>
  );
}