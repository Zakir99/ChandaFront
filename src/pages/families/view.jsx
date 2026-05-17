import {
  Edit2,
  ChevronLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  User,
  FileText,
  DollarSign,
  ChevronRight,
  Heart,
  Phone,
  Hash,
  Smartphone,
  Map,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchData from "../../hooks/useFetchData";
const FamilyView = () => {
  const [family, setFamily] = useState({});
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [deathSupportPayments, setDeathSupportPayments] = useState([]);
  const [activeTable, setActiveTable] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const { id } = useParams();
  const onError = (err) => {
    console.error(err);
  };
  const onSuccess = (data) => {
    setFamily(data);
    setMonthlyPayments(data.monthly_payments);
    setDeathSupportPayments(data.death_support_payments);
  };
  const { data, loading, error } = useFetchData({
    url: "families/" + id,
    onSuccess,
    onError,
  });

  useEffect(() => {
    if (data) {
      setFamily(data.familyReturn);
      setMonthlyPayments(data.monthly_payments);
      setDeathSupportPayments(data.death_support_payments);
    }
  }, [data]);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTable]);

  const onBack = () => navigate("/Admin/family");
  const onEdit = () => navigate(`/Admin/family/${id}/edit`);

  const getCurrentTableData = () => {
    return activeTable === "monthly" ? monthlyPayments : deathSupportPayments;
  };

  const currentData = getCurrentTableData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const InfoCard = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
      <div className="shrink-0 mt-1">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm sm:text-base truncate ${
            highlight
              ? "font-mono font-medium text-blue-600 dark:text-blue-400"
              : "font-medium text-gray-900 dark:text-white"
          }`}
        >
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "paid":
          return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
        case "unpaid":
          return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
        default:
          return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      }
    };

    return (
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1) ?? ""}
      </span>
    );
  };

  const MonthlyPaymentsTable = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Paid At
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/30"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize dark:text-white">
                    {payment.month}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {payment.year}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {parseFloat(payment.amount_per_family).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-gray-600 dark:text-gray-400"
                >
                  No monthly payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedData.length > 0 ? (
          paginatedData.map((payment) => (
            <div
              key={payment.id}
              className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 capitalize dark:text-white">
                    {payment.month} {payment.year}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 dark:text-gray-400">
                    Monthly Payment
                  </p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Paid at
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            No monthly payments found
          </div>
        )}
      </div>
    </>
  );

  const DeathSupportPaymentsTable = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Deceased Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Death Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Paid At
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/30"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {payment.deceased_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize dark:text-white">
                    {payment.death_type}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-gray-600 dark:text-gray-400"
                >
                  No death support payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedData.length > 0 ? (
          paginatedData.map((payment) => (
            <div
              key={payment.id}
              className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {payment.deceased_name}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 capitalize dark:text-gray-400">
                    {payment.death_type} death
                  </p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Paid at
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            No death support payments found
          </div>
        )}
      </div>
    </>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)} of{" "}
          {currentData.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    );
  };
  const DataCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700 h-full">
      <h3 className="text-sm font-medium text-gray-500 mb-3 dark:text-gray-400 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const DataRow = ({ label, value, copyable = false, type = "text" }) => {
    const displayValue = () => {
      if (!value) return "Not specified";
      if (type === "phone") return formatPhoneNumber(value);
      return value;
    };

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-1">
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-25">
          {label}:
        </span>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-gray-900 dark:text-white wrap-break-words">
            {displayValue()}
          </span>
          {copyable && value && (
            <button
              onClick={() => navigator.clipboard.writeText(value)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Helper function for phone formatting
  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
    // Add your phone formatting logic here
    return phone;
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {family.name || "Loading..."}
            </h1>
            <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">
              Family Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              family.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {family.status === "active" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {family.status?.charAt(0)?.toUpperCase() + family.status?.slice(1)}
          </span>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors dark:hover:bg-blue-900/30 dark:text-blue-400"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* UUID & Basic Info */}
        <DataCard title="Identification" icon={Hash}>
          <DataRow label="UUID" value={family?.uuid} copyable />
          <DataRow label="Family Name" value={family?.name} />
        </DataCard>

        {/* Contact Info */}
        <DataCard title="Contact Information" icon={Phone}>
          <DataRow label="Phone" value={family?.phone} type="phone" />
          <DataRow
            label="Login Phone"
            value={family?.login_phone}
            type="phone"
          />
        </DataCard>

        {/* Location Info */}
        <DataCard title="Location" icon={MapPin}>
          <DataRow label="City" value={family?.city} />
          <DataRow label="Location" value={family?.location} />
        </DataCard>
        {/* Notes - Full Width */}
        <div className="md:col-span-2 lg:col-span-3">
          <DataCard title="Notes" icon={FileText}>
            <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400 whitespace-pre-wrap">
              {family?.notes || "No notes available"}
            </p>
          </DataCard>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        {/* Tabs */}
        <div className="flex  dark:border-gray-700">
          <button
            onClick={() => setActiveTable("monthly")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors cursor-pointer ${
              activeTable === "monthly"
                ? "text-blue-600  border-blue-600 bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:bg-blue-900/20"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Monthly Payments
            <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs dark:bg-gray-700 dark:text-gray-300">
              {monthlyPayments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTable("death")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors cursor-pointer ${
              activeTable === "death"
                ? "text-blue-600  border-blue-600 bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:bg-blue-900/20"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            Death Support
            <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs dark:bg-gray-700 dark:text-gray-300">
              {deathSupportPayments.length}
            </span>
          </button>
        </div>

        {/* Table Content */}
        {activeTable === "monthly" ? (
          <MonthlyPaymentsTable />
        ) : (
          <DeathSupportPaymentsTable />
        )}

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default FamilyView;
