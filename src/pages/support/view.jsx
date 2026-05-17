import { useState, useEffect } from "react";
import {
  ArrowLeft, Users, FileText, CheckCircle, XCircle,
  MapPin, Edit, Check, Clock, Download, Filter,
  ChevronDown, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import Config from "../../Js/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import generatePDF from "../../components/supportPdf";
import PaymentModal from "../../components/PaymentModal.jsx";
import useFetchData from "../../hooks/useFetchData.js";

const DeathSupportView = () => {
  const [record, setRecord]                       = useState([]);
  const [data, setData]                           = useState([]);
  const [families, setFamilies]                   = useState([]);
  const [searchTerm, setSearchTerm]               = useState("");
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentFilter, setPaymentFilter]         = useState("all");
  const [showFilters, setShowFilters]             = useState(false);
  const [currentPage, setCurrentPage]             = useState(1);
  const [generatingPdf, setGeneratingPdf]         = useState(false);
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { id }   = useParams();

  useFetchData({
    url: "supports/" + id,
    onSuccess: (res) => {
      setFamilies(res.families || []);
      setRecord(res.support   || []);
      setData(res             || []);
    },
  });

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(n);

  const handleMarkAsPaid = async (familyId) => {
    setProcessingPayment(familyId);
    try {
      await axios.post(`${Config.apiUrl}payment/payUser`, { support_id: record.id, family_id: familyId });
      setFamilies((p) => p.map((f) => f.id === familyId ? { ...f, status: "paid", payment_id: null, amount: 0 } : f));
      toast.success("Marked as paid.");
    } catch { toast.error("Error marking as paid."); }
    finally  { setProcessingPayment(null); }
  };

  const handleCancelPayment = async (familyId, paymentId) => {
    setProcessingPayment(familyId);
    try {
      await axios.post(`${Config.apiUrl}payment/cancelPayUser`, { support_id: record.id, family_id: familyId, payment_id: paymentId });
      setFamilies((p) => p.map((f) => f.id === familyId ? { ...f, status: "unpaid", payment_id: null, amount: 0 } : f));
      toast.success("Payment cancelled.");
    } catch { toast.error("Error cancelling payment."); }
    finally  { setProcessingPayment(null); }
  };

  const paid      = families?.filter((f) => f.status === "paid").length ?? 0;
  const total     = families?.length ?? 0;
  const collected = paid  * (record?.amount_per_family || 0);
  const expected  = total * (record?.amount_per_family || 0);
  const pct       = expected > 0 ? Math.round((collected / expected) * 100) : 0;

  const filtered = families?.filter((f) => {
    if (searchTerm && !new RegExp(searchTerm, "i").test(f.name)) return false;
    if (paymentFilter === "paid")   return f.status === "paid";
    if (paymentFilter === "unpaid") return f.status !== "paid";
    return true;
  });

  const totalPages = Math.ceil(filtered?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated  = filtered?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [paymentFilter, searchTerm]);

  const handlePdf = async () => {
    setGeneratingPdf(true);
    await generatePDF({ record, families, setGeneratingPdf, paidfamilies: paid, totalfamilies: total, totalExpected: expected, totalCollected: collected });
    setGeneratingPdf(false);
  };

  if (!record) return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0e] flex items-center justify-center">
      <div className="text-center space-y-3">
        <XCircle className="mx-auto text-gray-300 dark:text-gray-700" size={40} />
        <p className="text-sm text-gray-500 dark:text-gray-400">Record not found</p>
        <button onClick={() => window.history.back()}
          className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 mx-auto transition-colors">
          <ArrowLeft size={13} /> Go back
        </button>
      </div>
    </div>
  );

  /* ─── shared card style (no border in light, subtle bg in dark) ─── */
  const card = "bg-white dark:bg-[#18181b] rounded-2xl";

  return (
    <div className="min-h-screen  dark:bg-[#0c0c0e] transition-colors duration-200">

      {/* ─── Slim topbar ─── */}
      <header className=" dark:bg-[#0c0c0e] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-14">
          <button onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-2">
            {!record.paid_at && (
              <button onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm">
                <CheckCircle size={13} /> Mark Complete
              </button>
            )}
            <button onClick={() => navigate(`/Admin/support/${record.uuid}/edit`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-accent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222226] transition-colors shadow-sm">
              <Edit size={13} /> Edit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pb-12">

        {record.pay_from_account ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Users size={28} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Paid from community account</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

            {/* ─── Sidebar ─── */}
            <aside className="space-y-4">

              {/* Identity */}
              <div className={`${card} p-5`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug tracking-tight">
                    {record.deceased_name}
                  </h1>
                  <span className={`mt-0.5 shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    record.death_type === "local"
                      ? "bg-teal-50 dark:bg-teal-900/25 text-teal-600 dark:text-teal-400"
                      : "bg-violet-50 dark:bg-violet-900/25 text-violet-600 dark:text-violet-400"
                  }`}>
                    {record.death_type === "local" ? <MapPin size={9} /> : <Users size={9} />}
                    {record.death_type === "local" ? "Local" : "External"}
                  </span>
                </div>
                {record.relationship && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    Relation: {record.relationship}
                  </p>
                )}
                <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    { label: "Family",     value: record.name },
                    { label: "Created by", value: record.created_by_name },
                    { label: "Created",    value: formatDate(record.created_at) },
                    ...(record.paid_at ? [{ label: "Completed", value: formatDate(record.paid_at), green: true }] : []),
                  ].map(({ label, value, green }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-0">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
                      <span className={`text-xs font-semibold ${green ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`${card} p-4`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Per family</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{fmt(record.amount_per_family)}</p>
                </div>
                <div className={`${card} p-4`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Progress</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {paid}<span className="text-gray-400 dark:text-gray-600 font-normal"> / {total}</span>
                  </p>
                </div>
              </div>

              {/* Collection */}
              <div className={`${card} p-5`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Collection</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{pct}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Collected</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(collected)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Expected</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmt(expected)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {record.notes && (
                <div className={`${card} p-5`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Notes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{record.notes}</p>
                </div>
              )}

              {/* PDF download */}
              <button onClick={handlePdf} disabled={generatingPdf}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 shadow-sm">
                {generatingPdf
                  ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Generating…</>
                  : <><Download size={14} /> Download PDF</>}
              </button>
            </aside>

            {/* ─── Main panel ─── */}
            <div className="space-y-4">

              {/* Filters */}
              <div className={`${card} overflow-hidden`}>
                <button onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#1f1f23] transition-colors">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Filter size={14} className="text-gray-400" />
                    Filter
                    {paymentFilter !== "all" && (
                      <span className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">· {paymentFilter}</span>
                    )}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
                </button>

                {showFilters && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Search</label>
                      <input type="text" placeholder="Search by name…" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/30 transition" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Status</label>
                      <div className="flex gap-2">
                        {[
                          { key: "all",    label: "All",    count: total },
                          { key: "paid",   label: "Paid",   count: paid },
                          { key: "unpaid", label: "Unpaid", count: total - paid },
                        ].map(({ key, label, count }) => (
                          <button key={key} onClick={() => setPaymentFilter(key)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                              paymentFilter === key
                                ? key === "paid"
                                  ? "bg-emerald-500 text-white"
                                  : key === "unpaid"
                                  ? "bg-amber-500 text-white"
                                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}>
                            {label} <span className="opacity-60">({count})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Families table */}
              <div className={`${card} overflow-hidden`}>
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Family payment status</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{filtered?.length} {filtered?.length === 1 ? "family" : "families"}</span>
                </div>

                {filtered?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Users size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">No families match your filters</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className=" border-gray-100 dark:border-gray-800  dark:bg-[#111113]">
                            <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 w-1/2">
                              Family
                            </th>
                            <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                              Status
                            </th>
                            <th className="px-5 py-2.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginated?.map((family) => (
                            <tr key={family.id}
                              className={` border-gray-100 dark:border-gray-800/80 last:border-0 transition-colors ${
                                family.status === "paid"
                                  ? "bg-emerald-50/50 dark:bg-emerald-950/15"
                                  : "hover:bg-gray-50/80 dark:hover:bg-[#1c1c20]"
                              }`}>
                              <td className="px-5 py-3.5">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{family.name}</span>
                              </td>
                              <td className="px-5 py-3.5">
                                {family.status === "paid" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle size={11} /> Paid
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/25 text-amber-700 dark:text-amber-400">
                                    <Clock size={11} /> Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                {family.status !== "paid" ? (
                                  <button onClick={() => handleMarkAsPaid(family.id, family.payment_id)}
                                    disabled={processingPayment === family.id}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-40">
                                    {processingPayment === family.id
                                      ? <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Processing</>
                                      : <><Check size={12} /> Mark paid</>}
                                  </button>
                                ) : (
                                  <button onClick={() => handleCancelPayment(family.id, family.payment_id)}
                                    disabled={processingPayment === family.id}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors disabled:opacity-40">
                                    {processingPayment === family.id
                                      ? <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Cancelling</>
                                      : <><X size={12} /> Cancel</>}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800  dark:bg-[#111113]">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filtered?.length)} of {filtered?.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
                            <ChevronLeft size={15} />
                          </button>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-15 text-center">
                            {currentPage} / {totalPages}
                          </span>
                          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {isModalOpen && (
        <PaymentModal data={data} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default DeathSupportView;