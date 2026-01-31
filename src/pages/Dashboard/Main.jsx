import React, { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  DollarSign,
  Calendar,
  Users,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Plus,
  FileText,
  User,
  Receipt,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Filter,
  Menu,
  X,
  ChevronLeft,
  Search,
  BookA,
  Book,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Config from "../../Js/Config";

// Main Dashboard View
export default function DashboardView() {
  const [monthly, setMonthly] = useState({});
  const [support, setSupport] = useState({});
  const [activeFamilies, setActiveFamilies] = useState(0);
  const [unpaidFamilies, setUnpaidFamilies] = useState(0);
  const [topUnpaidFamilies, setTopUnpaidFamilies] = useState([]);
  const [recentDeathSupport, setRecentDeathSupport] = useState([]);
  const collectionPercentage = (monthly.collected / monthly.expected) * 100;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${Config.apiUrl}dashboard`);
      const data = await response.json();
      setMonthly(data.monthly);
      setSupport(data.death_support);
      setActiveFamilies(data.active_families);
      setUnpaidFamilies(data.unpaid_supports);
      setTopUnpaidFamilies(data.top_unpaid_families);
      setRecentDeathSupport(data.recent_death_support);
    };
    fetchData();
  }, []);

  const onViewUnpaid = () => {
    navigate("/unpaid");
  };

  const onViewFamily = (family) => {
    navigate(`/family/${family.id}`);
  };

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto pb-20 md:pb-6">
      {/* Desktop Header */}
      <header className="mb-4 hidden md:block">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Community Payment Management</p>
      </header>

      {/* Fund Overview - Responsive Grid */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <StatCard
            icon={
              <Users className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            }
            label="Total Families"
            value={activeFamilies?.toLocaleString()}
            color="text-green-700"
          />
          <StatCard
            icon={<DollarSign className="w-4 h-4 md:w-5 md:h-5 text-red-600" />}
            label="Remaining Payments"
            value={monthly?.unpaid?.toLocaleString()}
            // fullValue={`${fundOverview.currentBalance.toLocaleString()}`}
            color="text-red-700"
          />

          <StatCard
            icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />}
            label="Monthly"
            value={`${activeFamilies.toLocaleString()}`}
            color="text-purple-700"
          />
          <StatCard
            icon={<Book className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />}
            label="Unpaid Supports"
            value={unpaidFamilies?.toLocaleString() || 0}
            fullValue={unpaidFamilies?.toLocaleString()}
            color="text-orange-700"
          />
        </div>
      </div>

      {/* Alert Banner for Unpaid */}
      <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl shadow-sm p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-base md:text-lg">
                Unpaid Families Alert
              </h3>
            </div>
            <p className="text-sm text-red-100 mb-3">
              {unpaidFamilies?.count} families •
              {/* {unpaidFamilies.totalDue.toLocaleString()} total due */}
            </p>
            <button
              onClick={() => onViewUnpaid()}
              className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 active:scale-95 transition-transform inline-flex items-center space-x-1"
            >
              <span>View All Unpaid</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Collection Progress */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Monthly Collection
        </h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {collectionPercentage?.toFixed(0)}% Collected
            </span>
            <span className="text-sm text-gray-600 font-medium">
              {monthly?.collected?.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}{" "}
              /
              {monthly?.expected?.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Expected</div>
            <div className="text-sm md:text-lg font-bold text-blue-700">
              {(monthly?.expected / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Collected</div>
            <div className="text-sm md:text-lg font-bold text-green-700">
              {(monthly?.collected / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Remaining</div>
            <div className="text-sm md:text-lg font-bold text-red-700">
              {(monthly?.unpaid / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      </div>

      {/* Top Unpaid Families */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            Top Unpaid
          </h2>
          <button
            onClick={onViewUnpaid}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {topUnpaidFamilies?.slice(0, 3).map((family) => (
            <div
              key={family.family_id}
              className="p-4 bg-white hover:bg-gray-50 rounded-xl cursor-pointer border border-gray-200 active:bg-gray-100 shadow-sm transition-colors"
              onClick={() => onViewFamily(family)}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Family Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
                    {family.family_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {family.unpaid_months}{" "}
                    {family.unpaid_months === 1 ? "Month" : "Months"} Unpaid
                  </p>
                </div>

                {/* Amount Badge */}
                <div className="flex-shrink-0">
                  <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                    <div className="font-bold text-red-700 text-lg whitespace-nowrap">
                      {family.total_unpaid}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Death Support Payments */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Death Support
        </h2>
        <div className="space-y-2">
          {recentDeathSupport?.map((payment) => (
            <div
              key={payment.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
            >
              {/* Header: Family Name and Status Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-base">
                    {payment.family_name}
                  </h3>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    payment?.paid_at
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {payment?.paid_at ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Paid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Unpaid</span>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  {payment.paid_at &&
                    new Date(payment.paid_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                </div>

                {/* Amount Display */}
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-red-600">{payment.total_expected}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-green-600">
                    {payment.total_collected}
                  </span>
                </div>
              </div>

              {/* Optional: Progress Bar */}
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (payment.total_collected / payment.total_expected) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions - Mobile Optimized */}
      {/* <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            icon={<Plus className="w-4 h-4 md:w-5 md:h-5" />}
            label="Record Payment"
            color="bg-blue-600 hover:bg-blue-700"
            path=''
          />
          <ActionButton
            icon={<Plus className="w-4 h-4 md:w-5 md:h-5" />}
            label="Death Support"
            color="bg-purple-600 hover:bg-purple-700"
          />
          <ActionButton
            icon={<FileText className="w-4 h-4 md:w-5 md:h-5" />}
            label="All Payments"
            color="bg-green-600 hover:bg-green-700"
          />
          <ActionButton
            icon={<Users className="w-4 h-4 md:w-5 md:h-5" />}
            label="Manage Families"
            color="bg-orange-600 hover:bg-orange-700"
          />
        </div>
      </div> */}
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, fullValue, color }) {
  return (
    <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl">
      <div className="flex justify-center mb-2">{icon}</div>
      <div
        className={`text-lg md:text-2xl font-bold mb-1 ${color}`}
        title={fullValue}
      >
        {value}
      </div>
      <div className="text-xs md:text-sm text-gray-600 truncate">{label}</div>
    </div>
  );
}

// function ActionButton({ icon, label, color, path }) {
//   const onClick = () => {
//     navigate(path);
//   };
//   return (
//     <button
//       className={`${color} text-white p-3 md:p-4 rounded-xl hover:shadow-md transition-all active:scale-95`}
//       onClick={onClick}
//     >
//       <div className="flex flex-col items-center space-y-1 md:space-y-2">
//         {icon}
//         <span className="text-xs md:text-sm font-medium">{label}</span>
//       </div>
//     </button>
//   );
// }
