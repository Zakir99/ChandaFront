import { useState, useEffect } from "react";
import axios from "axios";
import Config from "../Js/Config";
const ProfessionalCollectionDashboard = () => {
  const [timeRange, setTimeRange] = useState("overall");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [viewType, setViewType] = useState("progress");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let url = `${Config.apiUrl}dashboard/registerStates?timeRange=${timeRange}`;

      if (timeRange === "year") {
        url += `&year=${selectedYear}`;
      }

      if (timeRange === "month") {
        url += `&year=${selectedYear}&month=${selectedMonth}`;
      }

      const res = await axios.get(url);
      setCurrentData(res.data);
    };

    fetchData();
  }, [timeRange, selectedYear, selectedMonth]);
  useEffect(() => {
    const fetchFilters = async () => {
      const res = await axios.get(`${Config.apiUrl}dashboard/registerFilters`);
      setYears(res.data.years);
      setAvailableMonths(res.data.months);
    };

    fetchFilters();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Custom Select Component
  const CustomSelect = ({
    value,
    onChange,
    options,
    placeholder,
    className = "",
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-[#1A1A23] text-white text-sm border border-[#1F1F2A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  // Icon components (simple SVG replacements)
  const Icons = {
    Calendar: () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    BarChart: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    Target: () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    CheckCircle: () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    AlertCircle: () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    Download: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    ),
    Filter: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
    ),
    MoreVertical: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    ),
    TrendingUp: () => (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    DollarSign: () => (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    PieChart: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
  };

  if (currentData === null) return <div>Loading...</div>;

  return (
    <div className="bg-[#0B0B0F] font-sans">
      {/* Controls Section - Professional & Compact */}
 
      {/* Main Collection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progress Card - Professional & Spacious */}
        <div className="lg:col-span-2 bg-[#14141A] border border-[#24242E] rounded-2xl shadow-xl shadow-black/50 overflow-hidden">
          <div className="p-6">
            {/* Header with linear Accent */}
            <div className="flex justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20">
                    <Icons.BarChart className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Collection Progress
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Real-time overview
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pb-4">
                <div className="flex items-center gap-2 bg-[#1C1C24] rounded-xl p-1 border border-[#2C2C36]">
                  <button
                    onClick={() => setTimeRange("overall")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      timeRange === "overall"
                        ? "bg-linear-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                        : "text-gray-400 hover:text-white hover:bg-[#2C2C36]"
                    }`}
                  >
                    Overall
                  </button>
                  <button
                    onClick={() => setTimeRange("year")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      timeRange === "year"
                        ? "bg-linear-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                        : "text-gray-400 hover:text-white hover:bg-[#2C2C36]"
                    }`}
                  >
                    Yearly
                  </button>
                  <button
                    onClick={() => setTimeRange("month")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      timeRange === "month"
                        ? "bg-linear-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                        : "text-gray-400 hover:text-white hover:bg-[#2C2C36]"
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                {timeRange === "year" && (
                  <CustomSelect
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={years.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                    placeholder="Select year"
                    className="w-36"
                  />
                )}

                {timeRange === "month" && (
                  <>
                    <CustomSelect
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      options={months.map((month, index) => ({
                        value: (index + 1).toString(),
                        label: month,
                      }))}
                      placeholder="Select month"
                      className="w-32"
                    />
                    <CustomSelect
                      value={selectedYear}
                      onChange={setSelectedYear}
                      options={years.map((year) => ({
                        value: year,
                        label: year,
                      }))}
                      placeholder="Select year"
                      className="w-28"
                    />
                  </>
                )}
              </div>
            </div>
            <>
              {/* Progress Section with Elegant Spacing */}
              <div className="mb-8">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="text-4xl font-bold text-white">
                      {currentData?.percentage?.toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-3">complete</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Target Achievement</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {timeRange === "month"
                        ? months[parseInt(selectedMonth) - 1]
                        : ""}{" "}
                      {selectedYear}
                    </p>
                  </div>
                </div>

                {/* Progress Bar with Elegant Gradient */}
                <div className="relative h-3 bg-[#1C1C24] rounded-full overflow-hidden mb-3 border border-[#2C2C36]">
                  <div
                    className="absolute left-0 top-0 h-full bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(currentData.percentage, 100)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress to goal</span>
                  <span className="text-white font-medium">
                    Rs {currentData?.collected?.toLocaleString()}{" "}
                    <span className="text-gray-500">of </span>
                    Rs {currentData?.expected?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stats Grid with Professional Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1C1C24] rounded-xl p-5 border border-[#2C2C36] hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <Icons.Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-400">Expected</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    Rs {currentData?.expected?.toLocaleString()}
                  </p>
                  {/* <p className="text-xs text-emerald-400 mt-2">
                      Total target amount
                    </p> */}
                </div>

                <div className="bg-[#1C1C24] rounded-xl p-5 border border-[#2C2C36] hover:border-teal-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                      <Icons.CheckCircle className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-sm text-gray-400">Collected</span>
                  </div>
                  <p className="text-2xl font-bold text-teal-400">
                    Rs {currentData?.collected?.toLocaleString()}
                  </p>
                  {/* <p className="text-xs text-teal-400/70 mt-2">
                      Successfully collected
                    </p> */}
                </div>

                <div className="bg-[#1C1C24] rounded-xl p-5 border border-[#2C2C36] hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <Icons.AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-sm text-gray-400">Remaining</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">
                    Rs {currentData?.unpaid?.toLocaleString()}
                  </p>
                  {/* <p className="text-xs text-amber-400/70 mt-2">
                      Yet to collect
                    </p> */}
                </div>
              </div>
            </>
          </div>
        </div>

        {/* Quick Stats Card - Professional & Elegant */}
        <div className="bg-[#14141A] border border-[#24242E] rounded-2xl shadow-xl shadow-black/50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-linear-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20">
                <Icons.PieChart className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Quick Overview
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Key metrics at a glance
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Elegant Donut Chart */}
              <div className="flex items-center justify-between">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="#1C1C24"
                      strokeWidth="6"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      // strokeDashoffset={
                      //   2 * Math.PI * 42 * (1 - currentData.percentage / 100)
                      // }
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* <defs> */}
                    {/* <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    > */}
                      {/* <stop offset="0%" stopColor="#10b981" /> */}
                      {/* <stop offset="100%" stopColor="#34d399" /> */}
                    {/* </linearGradient> */}
                  {/* </defs> */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {currentData.percentage}%
                    </span>
                    <span className="text-[10px] text-gray-500">complete</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Expected</p>
                  <p className="text-2xl font-bold text-white">
                    Rs {currentData.expected}
                  </p>
                  {/* <p className="text-xs text-emerald-400 mt-1">
                    +8.3% vs last month
                  </p> */}
                </div>
              </div>

              {/* Stats with Professional Colors */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-[#24242E]">
                  <span className="text-sm text-gray-400">Expected</span>
                  <span className="text-sm font-semibold text-white">
                    Rs {currentData?.expected?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#24242E]">
                  <span className="text-sm text-gray-400">Collected</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Rs {currentData?.collected?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-400">Remaining</span>
                  <span className="text-sm font-semibold text-amber-400">
                    Rs {currentData?.unpaid?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCollectionDashboard;
