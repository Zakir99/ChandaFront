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
  Moon,
  Sun,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import Config from "../../Js/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import generatePDF from "../../components/supportPdf";
// import PaymentModal from "../../components/PaymentModal";

const DeathSupportView = () => {
  const [record, setRecord] = useState([]);
  const [families, setFamilies] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSupport = async () => {
      const response = await axios.get(`${Config.apiUrl}support/${id}`);
      setFamilies(response.data.families);
      setRecord(response.data.support);
      setData(response.data);
      setLoading(false);
    };
    fetchSupport();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

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

  const handleMarkAsPaid = async (familyId, paymentId) => {
    setProcessingPayment(familyId);

    try {
      await axios.post(`${Config.apiUrl}payment/payUser`, {
        support_id: record.id,
        family_id: familyId,
        payment_id: paymentId,
      });

      setFamilies((prev) =>
        prev.map((family) =>
          family.id === familyId
            ? {
                ...family,
                status: "paid",
                payment_id: null,
                amount: 0,
              }
            : family,
        ),
      );

      toast.success("Family marked as paid successfully!");
    } catch (error) {
      toast.error("Error marking family as paid!");
    } finally {
      setProcessingPayment(null);
    }
  };

  const paidfamilies = families?.filter((m) => m.status == "paid").length ?? 0;
  const totalfamilies = families?.length ?? 0;
  const totalCollected = paidfamilies * (record?.amount_per_member || 0);
  const totalExpected = totalfamilies * (record?.amount_per_member || 0);

  const filteredfamilies = families?.filter((family) => {
    if (searchTerm !== "") {
      const regex = new RegExp(searchTerm, "i");
      if (!regex.test(family.family_name)) return false;
    }

    if (paymentFilter === "paid") return family.paid;
    if (paymentFilter === "unpaid") return !family.paid;
    return true;
  });

  const totalPages = Math.ceil(filteredfamilies?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedfamilies = filteredfamilies?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={40} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Record not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested death support record does not exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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

  const getBgClass = (paid) => {
    return paid
      ? "from-green-500 to-green-600 dark:from-green-700 dark:to-green-800"
      : "from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className={`bg-linear-to-r ${getBgClass(record.paid_at)} text-white shadow-xl top-0`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Mark as Paid"
              >
                <CheckCircle size={20} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => navigate(`/support/${record.id}/edit`)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Edit record"
              >
                <Edit size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {record.deceased_name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    record.death_type === "local"
                      ? "bg-green-500 text-white"
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

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-blue-100 text-xs mb-1">Progress</div>
                <div className="text-2xl font-bold">
                  {paidfamilies}/{totalfamilies}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Stats & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <DollarSign
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Amount/Family
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(record.amount_per_member)}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <TrendingUp
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Collected
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalCollected)}
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  of {formatCurrency(totalExpected)}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(totalCollected / totalExpected) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Family Name
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {record.family_name}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Recorded By
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {record.recorded_by_name}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Created
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {formatDate(record.created_at)}
                  </span>
                </div>

                {record.paid_at && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Completed On
                    </span>
                    <span className="font-medium text-green-700 dark:text-green-400 text-sm">
                      {formatDate(record.paid_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {record.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 mb-3">
                  <FileText size={18} className="text-gray-400 mt-0.5" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notes
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {record.notes}
                </p>
              </div>
            )}

            {/* Generate PDF Button */}
            <button
              onClick={handlePdf}
              disabled={generatingPdf}
              className="w-full bg-linear-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white rounded-xl p-4 shadow-lg hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                {generatingPdf ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="font-semibold">Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span className="font-semibold">Download PDF Report</span>
                  </>
                )}
              </div>
              <p className="text-purple-100 text-xs mt-1">
                Printable record for offline use
              </p>
            </button>
          </div>

          {/* Right Column - Families List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Filter size={20} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-semibold">
                    Filter Families
                    {paymentFilter !== "all" && (
                      <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                        ({paymentFilter})
                      </span>
                    )}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFilters && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search by Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter family name..."
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentFilter("all")}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                          paymentFilter === "all"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        All ({families.length})
                      </button>
                      <button
                        onClick={() => setPaymentFilter("paid")}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                          paymentFilter === "paid"
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        Paid ({paidfamilies})
                      </button>
                      <button
                        onClick={() => setPaymentFilter("unpaid")}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                          paymentFilter === "unpaid"
                            ? "bg-orange-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        Unpaid ({totalfamilies - paidfamilies})
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Families List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Family Payment Status
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredfamilies?.length} family
                  {filteredfamilies?.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="p-6">
                {filteredfamilies?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users
                        size={32}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No families found
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedfamilies?.map((family) => (
                        <div
                          key={family.id}
                          className={`rounded-xl transition-all duration-200 border ${
                            family.status == "paid"
                              ? "bg-linear-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800"
                              : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md"
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between gap-4 mb-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-base flex-1 truncate">
                                {family.family_name}
                              </h3>

                              {family.status == "paid" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
                                  <CheckCircle size={14} />
                                  Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                                  <Clock size={14} />
                                  Pending
                                </span>
                              )}
                            </div>

                            {family.status != "paid" && (
                              <button
                                onClick={() =>
                                  handleMarkAsPaid(family.id, family.payment_id)
                                }
                                disabled={processingPayment === family.id}
                                className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
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
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {startIndex + 1}-
                            {Math.min(
                              startIndex + itemsPerPage,
                              filteredfamilies?.length,
                            )}{" "}
                            of {filteredfamilies?.length}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium px-4 text-gray-900 dark:text-white">
                              {currentPage} / {totalPages}
                            </span>
                            <button
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPages),
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
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
        </div>
      </div>

      {/* Payment Modal */}
      {/* {isModalOpen && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
          onSubmit={handleMarkAsPaid}
        />
      )} */}
    </div>
  );
};

export default DeathSupportView;
