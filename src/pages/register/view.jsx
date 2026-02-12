import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Users,
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  Calendar,
  History,
  Eye,
  CreditCard,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Check,
  Moon,
  Sun,
  DollarSign,
  Clock,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
// import "./view.css";
import { toast } from "react-toastify";
// Constants
const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount || 0);
};

// Sub-components
const StatsCard = ({ icon: Icon, value, label, color, gradient, isDark }) => (
  <div
    className={`${gradient} rounded-2xl shadow-lg p-6  ${
      isDark
        ? "border-gray-700/50 hover:shadow-2xl border"
        : "border-white/20 hover:shadow-xl"
    } transition-all duration-300 transform hover:-translate-y-1`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-3xl font-bold text-white drop-shadow-lg">
        {value}
      </span>
    </div>
    <p className="text-sm text-white/90 font-medium">{label}</p>
  </div>
);

const FilterButton = ({
  filter,
  currentFilter,
  label,
  count,
  onClick,
  color,
  isDark,
}) => (
  <button
    onClick={() => onClick(filter)}
    className={`px-6 py-3 text-sm rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
      currentFilter === filter
        ? `${color} text-white shadow-lg`
        : isDark
          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label} <span className="ml-1 opacity-75">({count})</span>
  </button>
);

const PaymentHistoryItem = ({
  payment,
  isSelected,
  isPaid,
  onSelect,
  formatDate,
  formatCurrency,
  isDark,
}) => {
  const canSelect = !isPaid;
  const isItemSelected = isSelected && canSelect;

  return (
    <div
      onClick={() => canSelect && onSelect(payment)}
      className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
        isPaid
          ? isDark
            ? "bg-black border-gray-700 cursor-default border-2"
            : "bg-white border-gray-200 cursor-default"
          : isItemSelected
            ? isDark
              ? "bg-blue-900 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20 border-2"
              : "bg-blue-50 border-blue-400 ring-2 ring-blue-200 shadow-lg"
            : isDark
              ? "bg-red-900 border-red-800 hover:border-red-600 border-2"
              : "bg-red-50 border-red-300 hover:border-red-400"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {canSelect && (
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300 ${
              isItemSelected
                ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/50"
                : isDark
                  ? "bg-gray-700 border-gray-600 border-2 "
                  : "bg-white border-gray-300"
            }`}
          >
            {isItemSelected && <Check className="w-4 h-4 text-white" />}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <p
              className={`font-bold text-base truncate ${
                isPaid
                  ? isDark
                    ? "text-gray-200"
                    : "text-gray-900"
                  : isItemSelected
                    ? isDark
                      ? "text-blue-300"
                      : "text-blue-700"
                    : isDark
                      ? "text-white"
                      : "text-red-700"
              }`}
            >
              {payment.month?.charAt(0).toUpperCase() + payment.month?.slice(1)}
              {payment.register_year && ` ${payment.register_year}`}
            </p>
            {isPaid ? (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isDark
                    ? "bg-green-900/50 text-green-300 border border-green-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Paid
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isItemSelected
                    ? isDark
                      ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                      : "bg-blue-100 text-blue-700"
                    : isDark
                      ? "bg-red-900/50 text-white border border-red-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Unpaid
              </span>
            )}
          </div>
          <p
            className={`text-sm ${
              isPaid
                ? isDark
                  ? "text-gray-400"
                  : "text-gray-600"
                : isItemSelected
                  ? isDark
                    ? "text-blue-400"
                    : "text-blue-600"
                  : isDark
                    ? "text-red-400"
                    : "text-red-600"
            }`}
          >
            {isPaid ? (
              `Paid on ${formatDate(payment.payment_date)}`
            ) : (
              <span className="font-semibold">Payment pending</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`text-xl font-bold ${
            isPaid
              ? isDark
                ? "text-gray-200"
                : "text-gray-900"
              : isItemSelected
                ? isDark
                  ? "text-blue-300"
                  : "text-blue-700"
                : isDark
                  ? "text-white"
                  : "text-red-700"
          }`}
        >
          {formatCurrency(payment.amount)}
        </span>
        {isPaid ? (
          <CheckCircle
            className={`w-6 h-6 ${isDark ? "text-green-400" : "text-green-500"}`}
          />
        ) : (
          <XCircle
            className={`w-6 h-6 ${
              isItemSelected
                ? isDark
                  ? "text-blue-400"
                  : "text-blue-500"
                : isDark
                  ? "text-red-400"
                  : "text-red-500"
            }`}
          />
        )}
      </div>
    </div>
  );
};

// Main Component
const MonthlyRegistersView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dark Mode State
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  // State Management
  const [register, setRegister] = useState(null);
  const [families, setFamilies] = useState([]);
  const [detailSearchTerm, setDetailSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({ type: "", text: "" });

  // Dark Mode Effect
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Derived State
  const paidFamilies = useMemo(
    () => families.filter((f) => Number(f.total_unpaid_amount) === 0),
    [families],
  );

  const unpaidFamilies = useMemo(
    () => families.filter((f) => Number(f.total_unpaid_amount) > 0),
    [families],
  );

  const paymentRate = useMemo(
    () =>
      families.length > 0
        ? ((paidFamilies.length / families.length) * 100).toFixed(1)
        : "0.0",
    [families.length, paidFamilies.length],
  );

  const totalDue = useMemo(
    () => unpaidFamilies.length * (register?.amount_per_member || 0),
    [unpaidFamilies.length, register],
  );

  const totalSelectedAmount = useMemo(
    () => selectedPayments.reduce((sum, payment) => sum + payment.amount, 0),
    [selectedPayments],
  );

  // Filter and Pagination
  const filteredFamilies = useMemo(() => {
    let filtered = families;

    if (paymentFilter === "not_paid") {
      filtered = filtered.filter((f) => f.payment_status === "not_paid");
    } else if (paymentFilter === "paid") {
      filtered = filtered.filter((f) => f.payment_status === "paid");
    }

    if (detailSearchTerm) {
      const term = detailSearchTerm.toLowerCase();
      filtered = filtered.filter((f) =>
        f.family_name?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [families, paymentFilter, detailSearchTerm]);

  const totalPages = Math.ceil(filteredFamilies.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFamilies = filteredFamilies.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const SelectedFamilyDueAmount = useMemo(
    () =>
      selectedFamily?.unpaid_breakdown?.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      ) || 0,
    [selectedFamily],
  );

  // Effects
  useEffect(() => {
    const fetchRegister = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}registers/${id}`);
        setRegister(response.data.register);
        setFamilies(response.data.families || []);
        console.log(response.data.families);
      } catch (error) {
        console.error("Error fetching register:", error);
      }
    };
    fetchRegister();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [detailSearchTerm, paymentFilter]);

  // Handlers
  const handlePaymentSelect = useCallback((payment) => {
    if (payment.is_paid) return;

    setSelectedPayments((prev) => {
      const isSelected = prev.some((p) => p.id === payment.id);

      if (isSelected) {
        const updated = prev.filter((p) => p.id !== payment.id);
        return updated;
      } else {
        return [...prev, payment];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const unpaidPayments =
      selectedFamily?.unpaid_breakdown?.filter((p) => !p.is_paid) || [];

    if (selectedPayments.length === unpaidPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(unpaidPayments);
    }
  }, [selectedFamily, selectedPayments.length]);

  const isPaymentSelected = useCallback(
    (paymentId) => selectedPayments.some((p) => p.id === paymentId),
    [selectedPayments],
  );

  const openPaymentModal = useCallback((family) => {
    setSelectedFamily(family);
    setIsModalOpen(true);
    setPaymentMessage({ type: "", text: "" });
    setSelectedPayments([]);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFamily(null);
    setIsProcessingPayment(false);
    setPaymentMessage({ type: "", text: "" });
    setSelectedPayments([]);
  }, []);

  const handlePayment = async () => {
    if (!selectedFamily || isProcessingPayment) return;
    setIsProcessingPayment(true);

    try {
      await axios.post(`${Config.apiUrl}payment/payAllUnpaid`, {
        familyId: selectedFamily.id,
      });

      setPaymentMessage({
        type: "success",
        text: `Payment of ${formatCurrency(
          register.amount_per_member,
        )} successfully recorded!`,
      });

      setIsProcessingPayment(false);
      setFamilies((prev) =>
        prev.map((family) =>
          family.id === selectedFamily.id
            ? {
                ...family,
                unpaid_breakdown: [],
                total_unpaid_amount: 0,
                payment_status: "paid",
              }
            : family,
        ),
      );

      setTimeout(closeModal, 2000);
    } catch (error) {
      setPaymentMessage({
        type: "error",
        text: "Payment failed. Please try again.",
      });
      setIsProcessingPayment(false);
    }
  };

  const handlePaySelected = async () => {
    if (selectedPayments.length === 0) return;

    setIsProcessingPayment(true);
    try {
      await axios.post(`${Config.apiUrl}payment/paySeparate`, {
        selectedPayments,
        familyId: selectedFamily.id,
      });

      toast.success(
        `${selectedPayments.length} payment(s) processed successfully!`,
      );

      setFamilies((prev) =>
        prev.map((family) => {
          if (family.id !== selectedFamily.id) return family;
          const selectedIds = selectedPayments.map((p) => p.id);
          const remainingUnpaid = family.unpaid_breakdown.filter(
            (p) => !selectedIds.includes(p.id),
          );

          const newTotal = remainingUnpaid.reduce(
            (sum, p) => sum + Number(p.amount),
            0,
          );

          return {
            ...family,
            unpaid_breakdown: remainingUnpaid,
            total_unpaid_amount: newTotal,
            payment_status: remainingUnpaid.length === 0 ? "paid" : "not_paid",
          };
        }),
      );
      setSelectedPayments([]);
      setIsProcessingPayment(false);
      setTimeout(closeModal, 2000);
    } catch (error) {
      toast.error("Error processing payment");
      setIsProcessingPayment(false);
    }
  };

  const goToList = () => {
    navigate("/register");
  };

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getPageNumbers = useCallback(() => {
    const pages = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Loading State
  if (!register) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-linear-to-br from-gray-50 to-gray-100"
        }`}
      >
        <div className="text-center">
          <Loader2
            className={`w-12 h-12 animate-spin mx-auto mb-4 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Loading register data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-gray-50 via-blue-50 to-gray-100"
      }`}
    >
      {/* Header Section */}
      <div
        className={`${
          isDark ? "bg-black border-b " : "bg-white/80 border-gray-200"
        } backdrop-blur-lg shadow-lg top-0`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToList}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isDark
                  ? "text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600"
                  : "text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Registers</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                className={`text-4xl font-bold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {register.month.charAt(0).toUpperCase() +
                  register.month.slice(1)}{" "}
                {register.year}
              </h1>
              <div
                className={`flex items-center gap-2 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Register Date: {formatDate(register.date)}</span>
              </div>
            </div>

            <button
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDark ? "bg-black" : "bg-white"}`}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            value={families.length}
            label="Total Families"
            gradient="bg-linear-to-br from-blue-500 to-blue-700"
            isDark={isDark}
          />
          <StatsCard
            icon={CheckCircle}
            value={paidFamilies.length}
            label="Paid Families"
            gradient="bg-linear-to-br from-green-500 to-green-700"
            isDark={isDark}
          />
          <StatsCard
            icon={XCircle}
            value={unpaidFamilies.length}
            label="Unpaid Families"
            gradient="bg-linear-to-br from-red-500 to-red-700"
            isDark={isDark}
          />
          <StatsCard
            icon={TrendingUp}
            value={`${paymentRate}%`}
            label="Payment Rate"
            gradient="bg-linear-to-br from-purple-500 to-purple-700"
            isDark={isDark}
          />
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`rounded-2xl shadow-lg p-6  transition-all duration-300 transform hover:-translate-y-1 ${
              isDark
                ? "bg-linear-to-br from-blue-900/50 to-blue-800/50 border-blue-700 border"
                : "bg-linear-to-br from-blue-50 to-blue-100 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-blue-800/50" : "bg-blue-200/50"
                }`}
              >
                <DollarSign
                  className={`w-5 h-5 ${
                    isDark ? "text-blue-300" : "text-blue-700"
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-blue-300" : "text-blue-900"
                }`}
              >
                Amount per Member
              </p>
            </div>
            <p
              className={`text-3xl font-bold ${
                isDark ? "text-blue-100" : "text-blue-900"
              }`}
            >
              {formatCurrency(register.amount_per_member)}
            </p>
          </div>

          <div
            className={`rounded-2xl shadow-lg p-6  transition-all duration-300 transform hover:-translate-y-1 ${
              isDark
                ? "bg-linear-to-br from-green-900/50 to-green-800/50 border-green-700 border"
                : "bg-linear-to-br from-green-50 to-green-100 border-green-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-green-800/50" : "bg-green-200/50"
                }`}
              >
                <CheckCircle
                  className={`w-5 h-5 ${
                    isDark ? "text-green-300" : "text-green-700"
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-green-300" : "text-green-900"
                }`}
              >
                Total Collected
              </p>
            </div>
            <p
              className={`text-3xl font-bold ${
                isDark ? "text-green-100" : "text-green-900"
              }`}
            >
              {formatCurrency(register.amount_per_member * paidFamilies.length)}
            </p>
          </div>

          <div
            className={`rounded-2xl shadow-lg p-6  transition-all duration-300 transform hover:-translate-y-1 ${
              isDark
                ? "bg-linear-to-br from-red-900/50 to-red-800/50 border-red-700 border"
                : "bg-linear-to-br from-red-50 to-red-100 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-red-800/50" : "bg-red-200/50"
                }`}
              >
                <Clock
                  className={`w-5 h-5 ${
                    isDark ? "text-white" : "text-red-700"
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-white" : "text-red-900"
                }`}
              >
                Total Outstanding
              </p>
            </div>
            <p
              className={`text-3xl font-bold ${
                isDark ? "text-red-100" : "text-red-900"
              }`}
            >
              {formatCurrency(totalDue)}
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`rounded-2xl shadow-lg p-6 mb-8  ${
            isDark
              ? "bg-black border-gray-700 border"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search families..."
                value={detailSearchTerm}
                onChange={(e) => setDetailSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 border-2"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-semibold">Filter:</span>
              </div>
              <div className="flex gap-2">
                <FilterButton
                  filter="all"
                  currentFilter={paymentFilter}
                  label="All"
                  count={families.length}
                  onClick={setPaymentFilter}
                  color="bg-blue-600"
                  isDark={isDark}
                />
                <FilterButton
                  filter="paid"
                  currentFilter={paymentFilter}
                  label="Paid"
                  count={paidFamilies.length}
                  onClick={setPaymentFilter}
                  color="bg-green-600"
                  isDark={isDark}
                />
                <FilterButton
                  filter="not_paid"
                  currentFilter={paymentFilter}
                  label="Unpaid"
                  count={unpaidFamilies.length}
                  onClick={setPaymentFilter}
                  color="bg-red-600"
                  isDark={isDark}
                />
              </div>
            </div>
          </div>

          <div
            className={`mt-4 flex items-center justify-between text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <span>
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredFamilies.length)} of{" "}
              {filteredFamilies.length} families
            </span>
          </div>
        </div>

        {/* Desktop Table */}
        <div
          className={`hidden md:block rounded-2xl shadow-lg overflow-hidden  ${
            isDark
              ? "bg-black border-gray-700 border"
              : "bg-white border-gray-200"
          }`}
        >
          <table className="w-full">
            <thead className={isDark ? "bg-gray-900/50" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Family Name
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Total
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Payment_status
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-12 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-100"}`}
            >
              {currentFamilies.map((family) => (
                <tr
                  key={family.id}
                  className={`transition-colors duration-200 border-0 shadow-sm ${
                    isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm font-bold ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {family.family_name}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm font-bold ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(
                        family.unpaid_breakdown.reduce(
                          (sum, payment) => sum + payment.amount,
                          0,
                        ),
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {family.payment_status === "paid" ? (
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
                          isDark
                            ? "bg-green-900/50 text-green-300 border border-green-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
                          isDark
                            ? "bg-red-900/50 text-white border border-red-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {family.status === "active" ? (
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
                          isDark
                            ? "bg-green-900/50 text-green-300 border border-green-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
                          isDark
                            ? "bg-red-900/50 text-white border border-red-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Deactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => openPaymentModal(family)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${
                        family.paid
                          ? isDark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/50"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      {family.paid ? "View Details" : "Pay Now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentFamilies.length === 0 && (
            <div
              className={`text-center py-16 ${
                isDark ? "bg-black" : "bg-gray-50"
              }`}
            >
              <AlertCircle
                className={`w-20 h-20 mx-auto mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <p
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                No families found
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentFamilies.length === 0 ? (
            <div
              className={`rounded-2xl p-12 text-center  ${
                isDark
                  ? "bg-black border-gray-700 border"
                  : "bg-white border-gray-200"
              }`}
            >
              <AlertCircle
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <p
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                No families found
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            currentFamilies.map((family) => (
              <div
                key={family.id}
                className={`rounded-2xl shadow-lg p-5 border transition-all duration-300 ${
                  isDark
                    ? "bg-black border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3
                      className={`font-bold text-base mb-1 truncate ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {family.family_name}
                    </h3>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(
                        family.paid
                          ? family.amount_paid
                          : register.amount_per_member,
                      )}
                    </p>
                  </div>
                  {family.payment_status == "paid" ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isDark
                          ? "bg-green-900/50 text-green-300 border border-green-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Paid
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isDark
                          ? "bg-red-900/50 text-red-300 border border-red-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Unpaid
                    </span>
                  )}
                </div>
                <button
                  onClick={() => openPaymentModal(family)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                    family.paid
                      ? isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/50"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  {family.paid ? "View Payment History" : "Make Payment"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`mt-8 rounded-2xl shadow-lg p-4 border ${
              isDark ? "bg-black border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-2 overflow-x-auto">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className={`px-2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-110 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : isDark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedFamily && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn">
          <div
            className={`rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp ${
              isDark ? "bg-black border border-gray-700" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`px-6 sm:px-8 py-6 sticky top-0 z-10 backdrop-blur-lg ${
                isDark
                  ? "bg-black border-gray-700 border-b "
                  : "bg-linear-to-r from-blue-50 to-indigo-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2
                    className={`text-2xl sm:text-3xl font-bold truncate ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedFamily.family_name}
                  </h2>
                  <p
                    className={`text-sm mt-1 font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Payment Management
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ml-3 ${
                    isDark
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-400 hover:text-gray-600 hover:bg-white"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              className="p-6 sm:p-8 overflow-y-auto"
              style={{ maxHeight: "calc(95vh - 220px)" }}
            >
              {/* Current Period */}
              <div className="mb-8">
                <h3
                  className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Calendar
                    className={`w-5 h-5 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  Current Period
                </h3>
                <div
                  className={`p-6 rounded-2xl ${
                    isDark
                      ? "bg-gray-900/50 border-gray-700 border"
                      : "bg-linear-to-br from-gray-50 to-gray-100 border-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p
                        className={`text-sm font-medium mb-2 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total Due
                      </p>
                      <p
                        className={`text-3xl font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {SelectedFamilyDueAmount > 0
                          ? formatCurrency(SelectedFamilyDueAmount)
                          : "$0.00"}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium mb-2 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Due Date
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatDate(register.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-bold flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <History
                    className={`w-5 h-5 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  Payment History
                </h3>

                {selectedFamily?.unpaid_breakdown?.some((p) => !p.is_paid) && (
                  <button
                    onClick={handleSelectAll}
                    className={`text-sm font-bold transition-colors ${
                      isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {selectedPayments.length ===
                    selectedFamily?.unpaid_breakdown?.filter((p) => !p.is_paid)
                      .length
                      ? "Deselect All"
                      : "Select All Unpaid"}
                  </button>
                )}
              </div>

              {selectedFamily?.unpaid_breakdown?.length > 0 ? (
                <div className="space-y-3 ">
                  {selectedFamily?.unpaid_breakdown?.map((payment) => (
                    <PaymentHistoryItem
                      key={payment.id}
                      payment={payment}
                      isSelected={isPaymentSelected(payment.id)}
                      isPaid={payment.is_paid}
                      onSelect={handlePaymentSelect}
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                      isDark={isDark}
                    />
                  ))}

                  {/* Selected Payments Action Bar */}
                  {selectedPayments.length > 0 && (
                    <div
                      className={`sticky bottom-0 mt-6 p-5 rounded-2xl shadow-2xl ${
                        isDark
                          ? "bg-blue-900/30 border-blue-700 border"
                          : "bg-linear-to-r from-blue-50 to-blue-100 border-blue-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-lg">
                            {selectedPayments.length}
                          </div>
                          <div>
                            <p
                              className={`font-bold ${
                                isDark ? "text-blue-300" : "text-blue-800"
                              }`}
                            >
                              {selectedPayments.length} payment
                              {selectedPayments.length !== 1 ? "s" : ""}{" "}
                              selected
                            </p>
                            <p
                              className={`text-sm ${
                                isDark ? "text-blue-400" : "text-blue-600"
                              }`}
                            >
                              Total:{" "}
                              <span className="font-bold">
                                {formatCurrency(totalSelectedAmount)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handlePaySelected}
                          disabled={isProcessingPayment}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 shadow-lg"
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5" />
                              Pay {formatCurrency(totalSelectedAmount)}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`text-center py-12 rounded-2xl  ${
                    isDark
                      ? "bg-gray-900/30 border-gray-700 border"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <AlertCircle
                    className={`w-12 h-12 mx-auto mb-3 ${
                      isDark ? "text-gray-600" : "text-gray-300"
                    }`}
                  />
                  <p
                    className={`text-base font-bold ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No payment history available
                  </p>
                </div>
              )}

              {/* Payment Message */}
              {paymentMessage.text && (
                <div
                  className={`mt-6 p-4 rounded-2xl text-base font-bold  ${
                    paymentMessage.type === "success"
                      ? isDark
                        ? "bg-green-900/30 text-green-300 border-green-700 border-2"
                        : "bg-green-100 text-green-700 border-green-200"
                      : isDark
                        ? "bg-red-900/30 text-white border-red-700 border-2"
                        : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {paymentMessage.text}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`px-6 sm:px-8 py-6 sticky bottom-0 backdrop-blur-lg ${
                isDark
                  ? "bg-black border-gray-700 border-t "
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  onClick={closeModal}
                  disabled={isProcessingPayment}
                  className={`flex-1 sm:flex-initial px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50  ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600 border-2"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                  }`}
                >
                  Close
                </button>
                {!selectedFamily.paid && selectedPayments.length === 0 && (
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="flex-1 sm:flex-initial px-6 py-3 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay All Unpaid
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyRegistersView;
