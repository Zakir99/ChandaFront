import { useState, useEffect } from "react";
import {
  Users,
  Target,
  CheckCircle,
  Clock,
  PieChart,
  DollarSign,
  XCircle,
    TrendingUp,
    Calendar,
} from "lucide-react";

// Compact Stats Card - 60% smaller
const CompactStatsCard = ({ icon: Icon, value, label, color, isDark }) => (
  <div
    className={`${color} rounded-xl shadow-md p-3 flex items-center gap-3 ${
      isDark ? "border-gray-700/50 border" : ""
    } transition-all hover:shadow-lg`}
  >
    <div className={`p-1.5 bg-white/20 rounded-lg`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <div>
      <p className="text-lg font-bold text-white leading-tight">{value}</p>
      <p className="text-[10px] text-white/80 uppercase tracking-wider">
        {label}
      </p>
    </div>
  </div>
);

// Mini Financial Card - Ultra compact
const MiniFinancialCard = ({ label, value, icon: Icon, color, isDark }) => (
  <div
    className={`rounded-xl ${color} shadow-sm p-2.5 ${isDark ? "border border-gray-700/50" : ""}`}
  >
    <div className="flex items-center justify-between">
      <div
        className={`p-1.5 rounded-lg ${isDark ? "bg-white/10" : "bg-white/30"}`}
      >
        <Icon
          className={`w-3 h-3 ${isDark ? "text-white" : "text-gray-800"}`}
        />
      </div>
      <p className="text-base font-bold">{value}</p>
    </div>
    <p className="text-[11px] mt-1 opacity-90 truncate">{label}</p>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, icon: Icon, isDark }) => (
  <div className="flex items-center gap-2 mb-3">
    <div
      className={`p-1.5 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
    >
      <Icon
        className={`w-4 h-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
      />
    </div>
    <h3
      className={`text-sm font-semibold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}
    >
      {title}
    </h3>
  </div>
);
// Main Component - Redesigned Layout
const RegisterDashboard = ({ register, families, isDark }) => {
  // Calculate financials
  const paidFamilies = families.filter((f) => f.payment_status === "paid");
  const unpaidFamilies = families.filter(
    (f) => f.payment_status === "not_paid",
  );
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount || 0);
  };
  const paymentRate = families.length
    ? ((paidFamilies.length / families.length) * 100).toFixed(0)
    : 0;

  // Register-specific financials
  const registerTotalDue = unpaidFamilies.reduce((sum, family) => {
    const registerUnpaid =
      family.unpaid_breakdown?.filter(
        (due) => due.register_id === register.id,
      ) || [];
    return sum + registerUnpaid.reduce((s, d) => s + d.amount, 0);
  }, 0);

  const registerCollected =
    paidFamilies.length * Number(register.amount_per_member);
  const registerExpected = families.length * Number(register.amount_per_member);

  // Overall financials (all registers)
  const overallTotalDue = unpaidFamilies.reduce(
    (sum, family) => sum + (family.total_unpaid_amount || 0),
    0,
  );
  const overallCollected = families.reduce((sum, family) => {
    const paidAmount =
      family.unpaid_breakdown
        ?.filter((due) => due.paid_at)
        .reduce((s, d) => s + d.amount, 0) || 0;
    return sum + paidAmount;
  }, 0);

  // Past registers total
  const pastRegistersDue = unpaidFamilies.reduce((sum, family) => {
    const pastUnpaid =
      family.unpaid_breakdown?.filter(
        (due) => due.register_id !== register.id,
      ) || [];
    return sum + pastUnpaid.reduce((s, d) => s + d.amount, 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Row 1: Quick Stats - Compact Grid */}
      <div className="grid grid-cols-4 gap-2">
        <CompactStatsCard
          icon={Users}
          value={families.length}
          label="Families"
          color="bg-linear-to-r from-blue-600 to-blue-500"
          isDark={isDark}
        />
        <CompactStatsCard
          icon={CheckCircle}
          value={paidFamilies.length}
          label="Paid"
          color="bg-linear-to-r from-green-600 to-green-500"
          isDark={isDark}
        />
        <CompactStatsCard
          icon={XCircle}
          value={unpaidFamilies.length}
          label="Unpaid"
          color="bg-linear-to-r from-red-600 to-red-500"
          isDark={isDark}
        />
        <CompactStatsCard
          icon={TrendingUp}
          value={`${paymentRate}%`}
          label="Rate"
          color="bg-linear-to-r from-purple-600 to-purple-500"
          isDark={isDark}
        />
      </div>

      {/* Row 2: Current Register Financials */}
      <div
        className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/50" : "bg-gray-50"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        <SectionHeader
          title={`CURRENT REGISTER • ${register.month} ${register.year}`}
          icon={Calendar}
          isDark={isDark}
        />
        <div className="grid grid-cols-4 gap-2">
          <MiniFinancialCard
            label="Per Member"
            value={formatCurrency(register.amount_per_member)}
            icon={Users}
            color={isDark ? "bg-blue-900/30" : "bg-blue-100"}
            isDark={isDark}
          />
          <MiniFinancialCard
            label="Expected"
            value={formatCurrency(registerExpected)}
            icon={Target}
            color={isDark ? "bg-purple-900/30" : "bg-purple-100"}
            isDark={isDark}
          />
          <MiniFinancialCard
            label="Collected"
            value={formatCurrency(registerCollected)}
            icon={CheckCircle}
            color={isDark ? "bg-green-900/30" : "bg-green-100"}
            isDark={isDark}
          />
          <MiniFinancialCard
            label="Due"
            value={formatCurrency(registerTotalDue)}
            icon={Clock}
            color={isDark ? "bg-red-900/30" : "bg-red-100"}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Row 3: Overall Financials (All Registers) */}
      <div
        className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/50" : "bg-gray-50"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        <SectionHeader
          title="OVERALL FINANCIALS • ALL REGISTERS"
          icon={DollarSign}
          isDark={isDark}
        />
        <div className="grid grid-cols-3 gap-2">
          <MiniFinancialCard
            label="Total Expected"
            value={formatCurrency(registerExpected + pastRegistersDue)}
            icon={Target}
            color={isDark ? "bg-gray-700" : "bg-gray-200"}
            isDark={isDark}
          />
          <MiniFinancialCard
            label="Total Collected"
            value={formatCurrency(overallCollected)}
            icon={CheckCircle}
            color={isDark ? "bg-green-900/30" : "bg-green-100"}
            isDark={isDark}
          />
          <MiniFinancialCard
            label="Total Due"
            value={formatCurrency(overallTotalDue)}
            icon={Clock}
            color={isDark ? "bg-red-900/30" : "bg-red-100"}
            isDark={isDark}
          />
        </div>

        {/* Past Registers Summary */}
        {pastRegistersDue > 0 && (
          <div className="mt-2 pt-2 border-t border-dashed border-gray-600/50">
            <p
              className={`text-[10px] flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              <span className="font-medium">Past Registers Due:</span>
              <span className="text-red-500 font-bold">
                {formatCurrency(pastRegistersDue)}
              </span>
              <span className="ml-1">from previous months</span>
            </p>
          </div>
        )}
      </div>

      {/* Row 4: Payment Status Summary */}
      <div
        className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/50" : "bg-gray-50"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        <SectionHeader
          title="PAYMENT BREAKDOWN"
          icon={PieChart}
          isDark={isDark}
        />
        <div className="grid grid-cols-4 gap-1 text-center">
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-white"} shadow-sm`}
          >
            <p className="text-xs text-gray-500">Paid</p>
            <p className="text-sm font-bold text-green-600">
              {paidFamilies.length}/{families.length}
            </p>
          </div>
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-white"} shadow-sm`}
          >
            <p className="text-xs text-gray-500">This Month</p>
            <p className="text-sm font-bold text-orange-600">
              {formatCurrency(registerTotalDue)}
            </p>
          </div>
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-white"} shadow-sm`}
          >
            <p className="text-xs text-gray-500">Past Due</p>
            <p className="text-sm font-bold text-red-600">
              {formatCurrency(pastRegistersDue)}
            </p>
          </div>
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-white"} shadow-sm`}
          >
            <p className="text-xs text-gray-500">Collection</p>
            <p className="text-sm font-bold text-purple-600">{paymentRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDashboard;
