import { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  FileText,
  ChevronDown,
  X,
} from "lucide-react";
import Config from "../../Js/Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const DeathSupportIndex = () => {
  const { isDark } = useTheme();
  const [deathSupports, setDeathSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    deathType: "",
    paidStatus: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDeathSupports = async () => {
      const response = await axios.get(`${Config.apiUrl}support`);
      setDeathSupports(response.data);
      setLoading(false);
    };

    fetchDeathSupports();
  }, []);
  const filteredData = deathSupports.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.deceased_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relationship?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDeathType =
      !filters.deathType || item.death_type === filters.deathType;
    const matchesPaidStatus =
      !filters.paidStatus ||
      (filters.paidStatus === "paid" ? item.paid_at : !item.paid_at);

    return matchesSearch && matchesDeathType && matchesPaidStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setDeathSupports(deathSupports.filter((item) => item.id !== id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not paid";
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
    }).format(amount);
  };

  const getTotalStats = () => {
    const total = filteredData.reduce(
      (sum, item) => sum + parseFloat(item.amount_per_member),
      0
    );
    const paid = filteredData.filter((item) => item.paid_at).length;
    const pending = filteredData.filter((item) => !item.paid_at).length;
    return { total, paid, pending };
  };

  const stats = getTotalStats();

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`text-white px-4 py-6 sticky top-0 z-10 shadow-lg ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Death Supports</h1>
          <p className={isDark ? 'text-slate-300 text-sm' : 'text-blue-100 text-sm'}>Manage support records</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`rounded-lg p-3 shadow-sm ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total</div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {filteredData.length}
            </div>
          </div>
          <div className={`rounded-lg p-3 shadow-sm ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Paid</div>
            <div className="text-lg font-bold text-green-600">{stats.paid}</div>
          </div>
          <div className={`rounded-lg p-3 shadow-sm ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Pending</div>
            <div className="text-lg font-bold text-orange-600">
              {stats.pending}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or relationship..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' 
                : 'bg-white border-gray-200'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <span className="text-gray-700 font-medium">Filters</span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Death Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters({ ...filters, deathType: "" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.deathType === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilters({ ...filters, deathType: "local" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.deathType === "local"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Local
                </button>
                <button
                  onClick={() =>
                    setFilters({ ...filters, deathType: "external" })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.deathType === "external"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  External
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters({ ...filters, paidStatus: "" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.paidStatus === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilters({ ...filters, paidStatus: "paid" })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.paidStatus === "paid"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() =>
                    setFilters({ ...filters, paidStatus: "pending" })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.paidStatus === "pending"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({ deathType: "", paidStatus: "" });
              }}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Death Support Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No records found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.deceased_name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.death_type === "local"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {item.death_type === "local" ? (
                            <>
                              <MapPin size={12} className="mr-1" /> Local
                            </>
                          ) : (
                            <>
                              <Users size={12} className="mr-1" /> External
                            </>
                          )}
                        </span>
                      </div>
                      {item.relationship && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User size={14} />
                          Relationship: {item.relationship}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Status Badge */}
                  <div className="flex items-center gap-2 mt-3">
                    {item.paid_at ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Paid
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full">
                        <XCircle size={16} className="text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">
                          Pending
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Amount */}
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">
                      Amount per Member
                    </span>
                    <span className="text-xl font-bold text-blue-700">
                      {formatCurrency(item.amount_per_member)}
                    </span>
                  </div>

                  {/* Date Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <Calendar size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                    {item.paid_at && (
                      <div className="flex items-start gap-2">
                        <DollarSign
                          size={16}
                          className="text-gray-400 mt-0.5"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Paid On</p>
                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(item.paid_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <FileText
                          size={16}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {item.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => {
                      navigate(`/support/${item.id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={18} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/support/${item.id}/edit`);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          navigate("/support/create");
        }}
        className="fixed bottom-18 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-20"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default DeathSupportIndex;
