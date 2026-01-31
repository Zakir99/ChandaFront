import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  MapPin,
  Edit,
  Check,
  Clock,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Config from "../../Js/Config";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import generatePDF from "../../components/supportPdf";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const DeathSupportView = () => {
  const { isDark } = useTheme();
  const [record, setRecord] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'paid', 'unpaid'
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const fetchSupport = async () => {
      const response = await axios.get(`${Config.apiUrl}support/${id}`);
      setFamilies(response.data.families);
      setRecord(response.data.support);
      setLoading(false);
    };
    fetchSupport();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleMarkAsPaid = async (familyId) => {
    setProcessingPayment(familyId);

    try {
      const response = await axios.post(`${Config.apiUrl}payment/payUser`, {
        support_id: record.id,
        family_id: familyId,
      });
      setFamilies(
        families.map((family) =>
          family.id === familyId
            ? {
                ...family,
                paid: true,
                paid_at: new Date().toISOString(),
                payment_method: "Cash",
              }
            : family
        )
      );
      toast.success("Family marked as paid successfully!");
    } catch (error) {
      toast.error("Error marking family as paid!");
    }
    setProcessingPayment(null);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      // Navigate back or delete
      window.history.back();
    }
  };

  const paidfamilies = families.filter((m) => m.status == "paid").length;
  const totalfamilies = families.length;
  const totalCollected = paidfamilies * (record?.amount_per_member || 0);
  const totalExpected = totalfamilies * (record?.amount_per_member || 0);

  // Filter families based on payment status
  const filteredfamilies = families.filter((family) => {
    if (searchTerm !== "") {
      const regex = new RegExp(searchTerm, "i");
      if (!regex.test(family.family_name)) return false;
    }

    if (paymentFilter === "paid") return family.paid;
    if (paymentFilter === "unpaid") return !family.paid;
    return true; // 'all'
  });

  // Pagination
  const totalPages = Math.ceil(filteredfamilies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedfamilies = filteredfamilies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-slate-950' : ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className={`min-h-screen p-4 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <XCircle size={32} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Record not found
          </h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            The requested death support record does not exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const handlePdf = async () => {
    setGeneratingPdf(true);
   
    await generatePDF({
      record,
      families,
      setGeneratingPdf,
      paidfamilies,
      totalfamilies,
      totalExpected,
      totalCollected,
    });
    setGeneratingPdf(false);
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`text-white px-4 py-6 sticky top-0 z-10 shadow-lg ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'}`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-white mb-4 hover:text-blue-100"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                {record.deceased_name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    record.death_type === "local"
                      ? "bg-blue-500 text-white"
                      : "bg-purple-500 text-white"
                  }`}
                >
                  {record.death_type === "local" ? (
                    <>
                      <MapPin size={12} className="mr-1" /> Local Death
                    </>
                  ) : (
                    <>
                      <Users size={12} className="mr-1" /> External Death
                    </>
                  )}
                </span>
                {record.relationship && (
                  <span className="text-blue-100 text-sm">
                    Relation: {record.relationship}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => {
                  navigate(`/support/${record.id}/edit`);
                }}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Edit size={20} />
              </button>
              {/* <button
                onClick={handleDelete}
                className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Amount/Family</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(record.amount_per_member)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Payment Progress</div>
            <div className="text-2xl font-bold text-gray-900">
              {paidfamilies}/{totalfamilies}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(paidfamilies / totalfamilies) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 shadow-sm border border-green-200">
            <div className="text-xs text-green-700 font-medium mb-1">
              Collected
            </div>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(totalCollected)}
            </div>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm border border-blue-200">
            <div className="text-xs text-blue-700 font-medium mb-1">
              Expected
            </div>
            <div className="text-xl font-bold text-blue-700">
              {formatCurrency(totalExpected)}
            </div>
          </div>
        </div>

        {/* Death Support Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Family ID</span>
              <span className="font-medium text-gray-900">
                #{record.family_id}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Recorded By</span>
              <span className="font-medium text-gray-900">
                User #{record.recorded_by}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Created</span>
              <span className="font-medium text-gray-900 text-sm">
                {formatDate(record.created_at)}
              </span>
            </div>

            {record.paid_at && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Completed On</span>
                <span className="font-medium text-green-700 text-sm">
                  {formatDate(record.paid_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {record.notes && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start gap-2 mb-2">
              <FileText size={18} className="text-gray-400 mt-0.5" />
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            </div>
            <p className="text-gray-700 leading-relaxed pl-7">{record.notes}</p>
          </div>
        )}

        {/* Generate PDF Button */}
        <button
          onClick={handlePdf}
          disabled={generatingPdf}
          className="w-full bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg p-4 shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-3">
            {generatingPdf ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="font-semibold">Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span className="font-semibold">
                  Download Payment Record (PDF)
                </span>
              </>
            )}
          </div>
          <p className="text-purple-100 text-xs mt-1">
            Printable record for offline use
          </p>
        </button>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-gray-700 font-medium">
              Filter families {paymentFilter !== "all" && `(${paymentFilter})`}
            </span>
          </div>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label htmlFor="">Name</label>
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-3 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">
              Payment Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentFilter("all")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                All ({families.length})
              </button>
              <button
                onClick={() => setPaymentFilter("paid")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === "paid"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Paid ({paidfamilies})
              </button>
              <button
                onClick={() => setPaymentFilter("unpaid")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === "unpaid"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Unpaid ({totalfamilies - paidfamilies})
              </button>
            </div>
          </div>
        )}

        {/* families Payment Status */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              families Payment Status
            </h2>
            <div className="text-sm text-gray-600">
              {filteredfamilies.length} family
              {filteredfamilies.length !== 1 ? "s" : ""}
            </div>
          </div>

          {filteredfamilies.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No families found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filter
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedfamilies.map((family) => (
                  <div
                    key={family.id}
                    className={`rounded-xl transition-all duration-200 ${
                      family.paid
                        ? "bg-linear-to-r from-emerald-50 to-green-50 border border-emerald-200"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        {/* Name */}
                        <h3 className="font-semibold text-gray-900 text-sm flex-1 truncate">
                          {family.family_name}
                        </h3>

                        {/* Status Badge */}
                        {family.status == "paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-300 shrink-0">
                            <CheckCircle size={12} />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300 shrink-0">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Pay Button - Only for unpaid */}
                      {!family.status == "paid" && (
                        <button
                          onClick={() => handleMarkAsPaid(family.id)}
                          disabled={processingPayment === family.id}
                          className="w-full mt-2.5 py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md active:scale-95"
                        >
                          {processingPayment === family.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              <span>Mark as Paid</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredfamilies.length
                      )}{" "}
                      of {filteredfamilies.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm font-medium px-3">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeathSupportView;
