import { Edit2, ChevronLeft, CheckCircle, XCircle, MapPin, Users, User, Calendar, FileText, DollarSign, Skull, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Config from "../../Js/Config";
import { useEffect, useState } from "react";

const FamilyView = () => {
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || "N/A"}</p>
      </div>
    </div>
  );

  const [family, setFamily] = useState({});
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [deathSupportPayments, setDeathSupportPayments] = useState([]);
  const [activeTable, setActiveTable] = useState("monthly"); // "monthly" or "death"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${Config.apiUrl}families/${id}`);
      const data = await response.json();
      setFamily(data.family);
      setMonthlyPayments(data.monthly_payments || []);
      setDeathSupportPayments(data.death_support_payments || []);
    };
    fetchData();
  }, [id]);

  // Reset to page 1 when switching tables
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTable]);

  const onBack = () => {
    navigate("/family");
  };

  const onEdit = () => {
    navigate(`/family/edit/${id}`);
  };

  // Pagination logic
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

  const MonthlyPaymentsTable = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Month</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Year</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Paid At</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                    {payment.month}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{payment.year}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {payment.status === "paid" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500">
                  No monthly payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {paginatedData.length > 0 ? (
          paginatedData.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {payment.month} {payment.year}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Monthly Payment</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === "paid"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {payment.status === "paid" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Amount per member</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Paid at</span>
                  <span className="text-sm text-gray-700">
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
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No monthly payments found
          </div>
        )}
      </div>
    </>
  );

  const DeathSupportPaymentsTable = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Deceased Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Death Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Paid At</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {payment.deceased_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                    {payment.death_type}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {payment.status === "paid" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500">
                  No death support payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {paginatedData.length > 0 ? (
          paginatedData.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {payment.deceased_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">
                    {payment.death_type} death
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === "paid"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {payment.status === "paid" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Amount per member</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Paid at</span>
                  <span className="text-sm text-gray-700">
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
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No death support payments found
          </div>
        )}
      </div>
    </>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)} of {currentData.length}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="hidden sm:block px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="hidden sm:inline text-gray-400">...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="hidden sm:inline text-gray-400">...</span>}
              <button
                onClick={() => goToPage(totalPages)}
                className="hidden sm:block px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Family Details</h2>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status Badge */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {family.family_name}
            </h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                family.status === "active"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {family.status === "active" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <XCircle className="w-3 h-3 mr-1" />
              )}
              {family?.status?.charAt(0)?.toUpperCase() + family?.status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Family Information
          </h4>
          <div className="space-y-0">
            <InfoRow icon={MapPin} label="City" value={family.city} />
            <InfoRow
              icon={Users}
              label="Total Members"
              value={family?.total_members?.toString()}
            />
            <InfoRow
              icon={User}
              label="Head Member ID"
              value={family?.head_member_id?.toString()}
            />
            <InfoRow
              icon={Calendar}
              label="Created"
              value={family.created_at ? new Date(family.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) : "N/A"}
            />
            <InfoRow
              icon={Calendar}
              label="Last Updated"
              value={family.updated_at ? new Date(family.updated_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) : "N/A"}
            />
          </div>
        </div>

        {/* Notes Card */}
        {family.notes && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {family.notes}
            </p>
          </div>
        )}

        {/* Payments Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Toggle Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTable("monthly")}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors ${
                activeTable === "monthly"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Monthly <span className="hidden xs:inline">Payments</span> ({monthlyPayments.length})</span>
            </button>
            <button
              onClick={() => setActiveTable("death")}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors ${
                activeTable === "death"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Skull className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Death <span className="hidden xs:inline">Support</span> ({deathSupportPayments.length})</span>
            </button>
          </div>

          {/* Table Content */}
          <div>
            {activeTable === "monthly" ? (
              <MonthlyPaymentsTable />
            ) : (
              <DeathSupportPaymentsTable />
            )}
          </div>

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default FamilyView;