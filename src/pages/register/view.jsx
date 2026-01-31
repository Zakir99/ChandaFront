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
  AlertTriangle,
  Check,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import { useTheme } from "../../context/ThemeContext";

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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

// Sub-components
const StatsCard = ({ icon: Icon, value, label, color, bgColor, textColor }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-sm sm:hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
      <div className={`p-1.5 sm:p-2 ${bgColor} rounded-lg sm:rounded-lg`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
      </div>
      <span className={`text-lg sm:text-xl font-bold ${textColor}`}>
        {value}
      </span>
    </div>
    <p className="text-xs text-gray-600 truncate">{label}</p>
  </div>
);

const FilterButton = ({
  filter,
  currentFilter,
  label,
  count,
  onClick,
  color,
}) => (
  <button
    onClick={() => onClick(filter)}
    className={`px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm rounded-lg font-semibold transition-all touch-manipulation active:scale-95 ${
      currentFilter === filter
        ? `${color} text-white shadow-md`
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label} ({count})
  </button>
);

const PaymentHistoryItem = ({
  payment,
  isSelected,
  isPaid,
  onSelect,
  formatDate,
  formatCurrency,
}) => {
  const canSelect = !isPaid;
  const isItemSelected = isSelected && canSelect;

  return (
    <div
      onClick={() => canSelect && onSelect(payment)}
      className={`flex items-center justify-between p-3 sm:p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer ${
        isPaid
          ? "bg-white border-gray-200 cursor-default"
          : isItemSelected
          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-100"
          : "bg-red-50 border-red-200 hover:border-red-300"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {canSelect && (
          <div
            className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded border shrink-0 ${
              isItemSelected
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
            }`}
          >
            {isItemSelected && (
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p
              className={`font-semibold text-sm sm:text-base truncate ${
                isPaid
                  ? "text-gray-900"
                  : isItemSelected
                  ? "text-blue-800"
                  : "text-red-700"
              }`}
            >
              {payment.month?.charAt(0).toUpperCase() + payment.month?.slice(1)}
              {payment.register_year && ` ${payment.register_year}`}
            </p>
            {isPaid ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                Paid
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  isItemSelected
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <XCircle className="w-3 h-3" />
                Unpaid
              </span>
            )}
          </div>
          <p
            className={`text-xs sm:text-sm ${
              isPaid
                ? "text-gray-600"
                : isItemSelected
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {isPaid ? (
              `Paid on ${formatDate(payment.payment_date)}`
            ) : (
              <span className="font-medium">Payment pending</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span
          className={`text-base sm:text-lg font-bold ${
            isPaid
              ? "text-gray-900"
              : isItemSelected
              ? "text-blue-700"
              : "text-red-700"
          }`}
        >
          {formatCurrency(payment.amount)}
        </span>
        {isPaid ? (
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
        ) : (
          <XCircle
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isItemSelected ? "text-blue-500" : "text-red-500"
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
  const { isDark } = useTheme();

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

  // Derived State
  const paidFamilies = useMemo(
    () => families.filter((f) => Number(f.total_unpaid_amount) === 0),
    [families]
  );

  const unpaidFamilies = useMemo(
    () => families.filter((f) => Number(f.total_unpaid_amount) > 0),
    [families]
  );

  const paymentRate = useMemo(
    () =>
      families.length > 0
        ? ((paidFamilies.length / families.length) * 100).toFixed(1)
        : "0.0",
    [families.length, paidFamilies.length]
  );

  const totalDue = useMemo(
    () => unpaidFamilies.length * (register?.amount_per_member || 0),
    [unpaidFamilies.length, register]
  );

  const totalSelectedAmount = useMemo(
    () => selectedPayments.reduce((sum, payment) => sum + payment.amount, 0),
    [selectedPayments]
  );

  // Filter and Pagination
const filteredFamilies = useMemo(() => {
  let filtered = families;

  if (paymentFilter === "not_paid") {
    filtered = filtered.filter(f => f.status === "not_paid");
  } else if (paymentFilter === "paid") {
    filtered = filtered.filter(f => f.status === "paid");
  }

  if (detailSearchTerm) {
    const term = detailSearchTerm.toLowerCase();
    filtered = filtered.filter(f =>
      f.family_name?.toLowerCase().includes(term)
    );
  }

  return filtered;
}, [families, paymentFilter, detailSearchTerm]);

  const totalPages = Math.ceil(filteredFamilies.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFamilies = filteredFamilies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const SelectedFamilyDueAmount = useMemo(
    () =>
      selectedFamily?.unpaid_breakdown?.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ) || 0,
    [selectedFamily]
  );

  // Effects
  useEffect(() => {
    const fetchRegister = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}registers/${id}`);
        setRegister(response.data.register);
        setFamilies(response.data.families || []);
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
    [selectedPayments]
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
        recordedBy: 10,
      });

      setPaymentMessage({
        type: "success",
        text: `Payment of ${formatCurrency(
          register.amount_per_member
        )} successfully recorded!`,
      });

      setIsProcessingPayment(false);
      console.log(selectedFamily);
      setFamilies((prev) =>
        prev.map((family) =>
          family.id === selectedFamily.id
            ? {
                ...family,
                unpaid_breakdown: [],
                total_unpaid_amount: 0,
                status: "paid",
              }
            : family
        )
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
        recordedBy: 1,
      });

      setPaymentMessage({
        type: "success",
        text: `${selectedPayments.length} payment(s) processed successfully!`,
      });

      setFamilies((prev) =>
        prev.map((family) => {
          if (family.id !== selectedFamily.id) return family;
          const selectedIds = selectedPayments.map((p) => p.id);
          const remainingUnpaid = family.unpaid_breakdown.filter(
            (p) => !selectedIds.includes(p.id)
          );

          const newTotal = remainingUnpaid.reduce(
            (sum, p) => sum + Number(p.amount),
            0
          );

          return {
            ...family,
            unpaid_breakdown: remainingUnpaid,
            total_unpaid_amount: newTotal,
            status: remainingUnpaid.length === 0 ? "paid" : "not_paid",
          };
        })
      );
      setSelectedPayments([]);
      setIsProcessingPayment(false);
      setIsModalOpen(false);
    } catch (error) {
      setPaymentMessage({
        type: "error",
        text: "Payment processing failed.",
      });
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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : ''}`}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header Section */}
      <div className={`border-b shadow-sm ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <button
            onClick={goToList}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-all touch-manipulation active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Registers</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {register.month.charAt(0).toUpperCase() +
                  register.month.slice(1)}{" "}
                {register.year}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Register Date: {formatDate(register.date)}</span>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm touch-manipulation active:scale-95">
              <Download className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Export Report
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            icon={Users}
            value={families.length}
            label="Total Families"
            color="#2563eb"
            bgColor="bg-blue-50"
            textColor="text-gray-900"
          />
          <StatsCard
            icon={CheckCircle}
            value={paidFamilies.length}
            label="Paid Families"
            color="#16a34a"
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatsCard
            icon={XCircle}
            value={unpaidFamilies.length}
            label="Unpaid Families"
            color="#dc2626"
            bgColor="bg-red-50"
            textColor="text-red-600"
          />
          <StatsCard
            icon={TrendingUp}
            value={`${paymentRate}%`}
            label="Payment Rate"
            color="#7c3aed"
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 sm:mb-6">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm p-3 sm:p-4 border border-blue-200">
            <p className="text-xs text-blue-900 mb-0.5 sm:mb-1.5 truncate">
              Amount per Member
            </p>
            <p className="text-lg sm:text-2xl font-bold text-blue-900">
              {formatCurrency(register.amount_per_member)}
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm p-3 sm:p-4 border border-green-200">
            <p className="text-xs text-green-900 mb-0.5 sm:mb-1.5 truncate">
              Total Collected
            </p>
            <p className="text-lg sm:text-2xl font-bold text-green-900">
              {formatCurrency(register.amount_per_member * paidFamilies.length)}
            </p>
          </div>

          <div className="bg-linear-to-br from-red-50 to-red-100 rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm p-3 sm:p-4 border border-red-200">
            <p className="text-xs text-red-900 mb-0.5 sm:mb-1.5 truncate">
              Total Outstanding
            </p>
            <p className="text-lg sm:text-2xl font-bold text-red-900">
              {formatCurrency(totalDue)}
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search families..."
                value={detailSearchTerm}
                onChange={(e) => setDetailSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 text-gray-600 mb-1 sm:mb-0">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <span className="text-xs sm:text-sm font-medium">Filter:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
                <FilterButton
                  filter="all"
                  currentFilter={paymentFilter}
                  label="All"
                  count={families.length}
                  onClick={setPaymentFilter}
                  color="bg-blue-600"
                />
                <FilterButton
                  filter="paid"
                  currentFilter={paymentFilter}
                  label="Paid"
                  count={paidFamilies.length}
                  onClick={setPaymentFilter}
                  color="bg-green-600"
                />
                <FilterButton
                  filter="not_paid"
                  currentFilter={paymentFilter}
                  label="Unpaid"
                  count={unpaidFamilies.length}
                  onClick={setPaymentFilter}
                  color="bg-red-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-600">
            <span>
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredFamilies.length)} of{" "}
              {filteredFamilies.length} families
            </span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Family Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentFamilies.map((family) => (
                <tr
                  key={family.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {family.family_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(
                        family.paid
                          ? family.amount_paid
                          : register.amount_per_member
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {family.paid ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <XCircle className="w-4 h-4" />
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openPaymentModal(family)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                        family.paid
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
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
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No families found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          {currentFamilies.length === 0 ? (
            <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-gray-100">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg font-medium">
                No families found
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            currentFamilies.map((family) => (
              <div
                key={family.id}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">
                      {family.family_name}
                    </h3>
                  </div>
                  {family.status == "paid" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Paid</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 shrink-0">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Unpaid</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => openPaymentModal(family)}
                  className={`w-full mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg text-sm font-semibold transition-all touch-manipulation active:scale-95 ${
                    family.paid
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm"
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
          <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold transition-all touch-manipulation active:scale-95 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation active:scale-95"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedFamily && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {selectedFamily.full_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Payment Management
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg ml-2 shrink-0 touch-manipulation active:scale-95"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div
              className="p-4 sm:p-8 overflow-y-auto"
              style={{ maxHeight: "calc(95vh - 180px)" }}
            >
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Current Period
                  </h3>
                  {/* {selectedFamily.paid ? (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-700">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-700">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Unpaid
                    </span>
                  )} */}
                </div>
                <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Total Due
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {SelectedFamilyDueAmount > 0
                          ? formatCurrency(SelectedFamilyDueAmount)
                          : "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Due Date
                      </p>
                      <p className="text-base sm:text-xl font-bold text-gray-900">
                        {formatDate(register.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Payment History
                </h3>

                {selectedFamily?.unpaid_breakdown?.some((p) => !p.is_paid) && (
                  <button
                    onClick={handleSelectAll}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                <div className="space-y-2 sm:space-y-3">
                  {selectedFamily?.unpaid_breakdown?.map((payment) => (
                    <PaymentHistoryItem
                      key={payment.id}
                      payment={payment}
                      isSelected={isPaymentSelected(payment.id)}
                      isPaid={payment.is_paid}
                      onSelect={handlePaymentSelect}
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                    />
                  ))}

                  {/* Action Bar for Selected Payments */}
                  {selectedPayments.length > 0 && (
                    <div className="sticky bottom-0 mt-4 p-4 bg-linear-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-lg">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            {selectedPayments.length}
                          </div>
                          <div>
                            <p className="font-semibold text-blue-800">
                              {selectedPayments.length} payment
                              {selectedPayments.length !== 1 ? "s" : ""}{" "}
                              selected
                            </p>
                            <p className="text-sm text-blue-600">
                              Total amount:{" "}
                              <span className="font-bold">
                                {formatCurrency(totalSelectedAmount)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handlePaySelected}
                          disabled={isProcessingPayment}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <CreditCard className="w-4 h-4" />
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay Selected (${formatCurrency(
                              totalSelectedAmount
                            )})`
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Total Unpaid Summary */}
                  {/* {selectedFamily?.total_unpaid_amount > 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <p className="font-semibold text-red-700">
                            Total Unpaid
                          </p>
                        </div>
                        <p className="text-xl font-bold text-red-700">
                          {formatCurrency(selectedFamily.total_unpaid_amount)}
                        </p>
                      </div>
                    </div>
                  )} */}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl border border-gray-200">
                  <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-gray-500 font-medium">
                    No payment history available
                  </p>
                </div>
              )}

              {paymentMessage.text && (
                <div
                  className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl text-sm sm:text-base font-medium ${
                    paymentMessage.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {paymentMessage.text}
                </div>
              )}
            </div>

            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={closeModal}
                    disabled={isProcessingPayment}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation active:scale-95"
                  >
                    Close
                  </button>
                  {!selectedFamily.paid && (
                    <button
                      onClick={handlePayment}
                      disabled={
                        isProcessingPayment || selectedPayments.length > 0
                      }
                      className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 active:bg-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation active:scale-95"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyRegistersView;
