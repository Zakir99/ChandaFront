import { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
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
  Heart,
  Filter,
} from "lucide-react";
import Config from "../../Js/Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const DeathSupportIndex = () => {
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
      try {
        const response = await axios.get(`${Config.apiUrl}support`);
        setDeathSupports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch death supports:", error);
        setLoading(false);
      }
    };
    fetchDeathSupports();
  }, []);

  const filteredData = deathSupports.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.deceased_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paid_amount?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDeathType =
      !filters.deathType || item.death_type === filters.deathType;
    const matchesPaidStatus =
      !filters.paidStatus ||
      (filters.paidStatus === "paid" ? item.paid_at : !item.paid_at);

    return matchesSearch && matchesDeathType && matchesPaidStatus;
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#000000",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${Config.apiUrl}support/${id}`);
      toast.success("Death support deleted successfully!");
      setDeathSupports((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete death support:", error);
      toast.error("Error deleting death support");
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

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat("en-US",{
  //     style: "currency",
  //     currency: "PKR",
  //   }).format(amount);
  // };

  const stats = {
    total: filteredData.length,
    paid: filteredData.filter((item) => item.paid_at).length,
    pending: filteredData.filter((item) => !item.paid_at).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Death Supports
          </h1>
          <p className="text-muted-foreground mt-1">Manage support records</p>
        </div>
        <button
          onClick={() => navigate("/support/create")}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Support
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stats.paid}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Search and Filters Header */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or paid_amount..."
                className="w-full h-11 pl-10 pr-10 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-input rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-30"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="pt-6 border-t border-border space-y-6 animate-in fade-in-50 slide-in-from-top-5 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Death Type Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Death Type
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "", label: "All", color: "bg-muted" },
                    { value: "local", label: "Local", color: "bg-blue-500/10" },
                    {
                      value: "external",
                      label: "External",
                      color: "bg-amber-500/10",
                    },
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setFilters({ ...filters, deathType: value })
                      }
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.deathType === value
                          ? `${color} text-foreground border border-ring shadow-sm`
                          : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Payment Status
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "", label: "All", color: "bg-muted" },
                    {
                      value: "paid",
                      label: "Paid",
                      color: "bg-emerald-500/10",
                    },
                    {
                      value: "pending",
                      label: "Pending",
                      color: "bg-amber-500/10",
                    },
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setFilters({ ...filters, paidStatus: value })
                      }
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.paidStatus === value
                          ? `${color} text-foreground border border-ring shadow-sm`
                          : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ deathType: "", paidStatus: "" });
                }}
                className="flex-1 py-2.5 px-4 border border-input rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Cards List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-foreground font-medium">No records found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border rounded-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Deceased Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Paid Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Paid On
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-foreground">
                        {item.deceased_name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.death_type === "local"
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {item.death_type === "local" ? (
                          <>
                            <MapPin className="w-3 h-3 mr-1" /> Local
                          </>
                        ) : (
                          <>
                            <Users className="w-3 h-3 mr-1" /> External
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {item.paid_amount || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-primary">
                        {item.paid_amount}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {item.paid_at ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-sm text-foreground">
                      {item.paid_at ? formatDate(item.paid_at) : "-"}
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/support/${item.id}`)}
                          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/support/${item.id}/edit`)}
                          className="p-2 bg-secondary border border-border text-muted-foreground rounded-lg hover:text-foreground hover:bg-secondary/80 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-secondary border border-error/20 text-error rounded-lg hover:bg-error/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.deceased_name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.death_type === "local"
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {item.death_type === "local" ? (
                            <>
                              <MapPin className="w-3 h-3 mr-1" /> Local
                            </>
                          ) : (
                            <>
                              <Users className="w-3 h-3 mr-1" /> External
                            </>
                          )}
                        </span>
                      </div>
                      {item.paid_amount && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Paid Amount: {item.paid_amount}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.paid_at ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning/10 text-warning rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 px-3 bg-primary/10 rounded-lg">
                    <span className="text-sm text-muted-foreground font-medium">
                      Amount per Member
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {item.paid_amount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium text-foreground">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                    {item.paid_at && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Paid On
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(item.paid_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-foreground">
                            {item.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 bg-secondary/30 border-t border-border flex gap-2">
                  <button
                    onClick={() => navigate(`/support/${item.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/support/${item.id}/edit`)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-secondary border border-border text-muted-foreground rounded-lg font-medium hover:text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-secondary border border-error/20 text-error rounded-lg font-medium hover:bg-error/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DeathSupportIndex;
