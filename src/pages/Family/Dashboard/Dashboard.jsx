import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Heart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Gift,
  Star,
  FileText,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";
import useFetchData from "../../../hooks/useFetchData";
const ClientDashboard = ({ clientId, apiBaseUrl = "/api" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data, refetch } = useFetchData({
    url: "dashboard/familyStats",
    onSuccess: (result) => {
      setDashboardData(result.data);
      setLoading(false);
    },
    onError: (err) => {
      console.error("Error fetching dashboard data:", err);
    },
  });
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  // Capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    trendValue,
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6  hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <ArrowUpRight size={14} className="text-green-500" />
              ) : (
                <ArrowDownRight size={14} className="text-red-500" />
              )}
              <span
                className={`text-xs font-medium ml-1 ${trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  // Info Card Component
  const InfoCard = ({ title, children, icon: Icon, action }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm  overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between ">
        <div className="flex items-center space-x-2">
          <Icon size={18} className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        {action && (
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">
            {action}
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  // Pending Payments Component
  const PendingPayments = ({ payments }) => (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl "
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(payment.amount_per_family)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {capitalize(payment.month)} {payment.year}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Due: {formatDate(payment.date)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
              Pending
            </span>
          </div>
        </div>
      ))}
      {payments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No pending payments
        </p>
      )}
    </div>
  );

  // Recent Paid Payments Component
  const RecentPaidPayments = ({ payments }) => (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-xl "
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(payment.amount_per_family)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {capitalize(payment.month)} {payment.year}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Paid: {formatDate(payment.paid_at)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              Paid
            </span>
            <button className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
              <FileText size={16} />
            </button>
          </div>
        </div>
      ))}
      {payments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No recent payments
        </p>
      )}
    </div>
  );

  // Death Support Pending Component
  const DeathSupportPending = ({ payments }) => (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl "
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Heart
                  size={14}
                  className="text-purple-600 dark:text-purple-400"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Death Support for {payment.deceased_name}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {payment.relationship} of {payment.deceased_family_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Death Type: {capitalize(payment.death_type)}
              </p>
            </div>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-100 dark:border-purple-800">
            <p className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(payment.amount_per_family)}
            </p>
          </div>
        </div>
      ))}
      {payments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No pending death support payments
        </p>
      )}
    </div>
  );

  // Summary Banner Component
  const SummaryBanner = ({ summary, monthlyPending, deathPending }) => (
    <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Payment Summary</h3>
          <p className="text-blue-100">
            Total pending amount across all categories
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-3xl font-bold">
            {formatCurrency(summary?.total_pending_all || 0)}
          </p>
          <p className="text-blue-100 text-sm">
            {summary?.total_upcoming_payments || 0} pending payments
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-500">
        <div>
          <p className="text-blue-100 text-sm">Monthly Payments</p>
          <p className="text-xl font-semibold">
            {formatCurrency(monthlyPending)}
          </p>
          <p className="text-blue-100 text-xs">
            {monthlyPending > 0 ? "Overdue payments" : "All paid"}
          </p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Death Support</p>
          <p className="text-xl font-semibold">
            {formatCurrency(deathPending)}
          </p>
          <p className="text-blue-100 text-xs">Pending contributions</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen  dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Error loading dashboard: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { family, monthly_payments, death_support_payments, summary } =
    dashboardData;
  const monthlyPending = monthly_payments?.total_pending_amount || 0;
  const deathPending = death_support_payments?.total_pending_amount || 0;

  return (
    <div className="min-h-screen  dark:bg-gray-950/50 transition-colors duration-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {family?.name?.charAt(0) || "F"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Family Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome, {family?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Family ID: {family?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Banner */}
        <SummaryBanner
          summary={summary}
          monthlyPending={monthlyPending}
          deathPending={deathPending}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Pending"
            value={formatCurrency(summary.total_pending_all)}
            subtitle={`${summary.total_upcoming_payments} payments pending`}
            icon={AlertCircle}
            color="bg-gradient-to-br from-orange-500 to-red-600"
            trend="up"
            trendValue="Needs attention"
          />
          <StatCard
            title="Monthly Pending"
            value={formatCurrency(monthlyPending)}
            subtitle={`${monthly_payments?.pending_payments_count || 0} month${monthly_payments?.pending_payments_count !== 1 ? "s" : ""}`}
            icon={DollarSign}
            color="bg-gradient-to-br from-yellow-500 to-orange-600"
          />
          <StatCard
            title="Death Support Pending"
            value={formatCurrency(deathPending)}
            subtitle={`${death_support_payments?.pending_payments_count || 0} contribution${death_support_payments?.pending_payments_count !== 1 ? "s" : ""}`}
            icon={Heart}
            color="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <StatCard
            title="Recent Payments"
            value={monthly_payments?.recent_paid?.length || 0}
            subtitle="Successful payments"
            icon={CheckCircle}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 overflow-x-auto">
            {["overview", "monthly", "death_support"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-3 px-1 text-sm font-medium transition-colors capitalize whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }
                `}
              >
                {tab === "overview" && "Overview"}
                {tab === "monthly" && "Monthly Payments"}
                {tab === "death_support" && "Death Support"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoCard
                title="Pending Monthly Payments"
                icon={Clock}
                action="View All"
              >
                <PendingPayments
                  payments={monthly_payments?.recent_pending || []}
                />
              </InfoCard>

              <InfoCard title="Recent Paid Monthly Payments" icon={CheckCircle}>
                <RecentPaidPayments
                  payments={monthly_payments?.recent_paid || []}
                />
              </InfoCard>
            </div>
          )}

          {activeTab === "monthly" && (
            <div className="space-y-6">
              <InfoCard
                title="Pending Monthly Contributions"
                icon={AlertTriangle}
              >
                <PendingPayments
                  payments={monthly_payments?.recent_pending || []}
                />
              </InfoCard>

              <InfoCard title="Payment History" icon={FileText}>
                <RecentPaidPayments
                  payments={monthly_payments?.recent_paid || []}
                />
              </InfoCard>
            </div>
          )}

          {activeTab === "death_support" && (
            <div className="space-y-6">
              <InfoCard
                title="Pending Death Support Contributions"
                icon={Heart}
              >
                <DeathSupportPending
                  payments={death_support_payments?.recent_pending || []}
                />
              </InfoCard>

              {death_support_payments?.recent_paid?.length > 0 && (
                <InfoCard
                  title="Recent Death Support Payments"
                  icon={CheckCircle}
                >
                  <RecentPaidPayments
                    payments={death_support_payments?.recent_paid || []}
                  />
                </InfoCard>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition">
            <Plus size={20} className="text-blue-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Make Payment
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition">
            <Download size={20} className="text-blue-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Download Statement
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition">
            <Bell size={20} className="text-blue-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Payment Reminders
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
