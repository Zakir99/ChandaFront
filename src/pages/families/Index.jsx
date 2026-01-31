import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";

const FamiliesTable = () => {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("family_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);

  const onEdit = (family) => {
    navigate(`/family/${family.id}/edit`);
  };

  const onView = (family) => {
    navigate(`/family/${family.id}`);
  };

  const onAdd = () => {
    navigate("/family/create");
  };

  const onDelete = (family) => {
    if (window.confirm("Are you sure you want to delete this family?")) {
      const response = axios.delete(`${Config.apiUrl}families/${family.id}`);
      if (response.status === 200) {
        navigate("/family");
      } else {
        console.log(response.data);
      }
    }
  };
  const fetchFamilies = async () => {
    const response = await axios.get(`${Config.apiUrl}families`);
    return response.data;
  };

  useEffect(() => {
    fetchFamilies().then((data) => {
      setFamilies(data);
    });
  }, []);

  // Process and filter data
  const processedData = useMemo(() => {
    let filtered = families.filter((family) => {
      const matchesSearch =
        family.family_name.toLowerCase().includes(filter.toLowerCase()) ||
        family.city.toLowerCase().includes(filter.toLowerCase()) ||
        family.notes?.toLowerCase().includes(filter.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || family.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [families, filter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const StatusBadge = ({ status }) => {
    const config = {
      active: {
        icon: CheckCircle,
        className: "bg-green-50 text-green-700 border-green-200",
        iconClass: "text-green-500",
      },
      inactive: {
        icon: XCircle,
        className: "bg-red-50 text-red-700 border-red-200",
        iconClass: "text-red-500",
      },
    };

    const {
      icon: Icon,
      className,
      iconClass,
    } = config[status] || config.active;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${className}`}
      >
        <Icon className={`w-3 h-3 mr-1 ${iconClass}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => {
        if (sortBy === field) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortBy(field);
          setSortOrder("asc");
        }
      }}
      className={`flex items-center justify-center px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
        sortBy === field
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
      {sortBy === field &&
        (sortOrder === "asc" ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        ))}
    </button>
  );

  return (
    <div className="bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-gray-900">Families</h2>
            <span className="text-sm text-gray-600">
              {processedData.length} total
            </span>
          </div>

          {/* Add Family Button */}
          <button
            onClick={() => {
              onAdd()
            }}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Family
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search families..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>

          <div className="flex space-x-2">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  statusFilter === status
                    ? status === "active"
                      ? "bg-green-100 text-green-700"
                      : status === "inactive"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Sort by
            </label>
            <div className="grid grid-cols-2 gap-2">
              <SortButton field="family_name" label="Name" />
              <SortButton field="city" label="City" />
              <SortButton field="total_members" label="Members" />
              <SortButton field="created_at" label="Date" />
            </div>
          </div>
        )}
      </div>

      {/* Family Cards */}
      <div className="p-4 space-y-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((family) => (
            <div
              key={family.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 mr-2">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      {family.family_name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {family.city}
                    </div>
                  </div>
                  <StatusBadge status={family.status} />
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    {family.total_members} members
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(family.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={() => onView?.(family)}
                  className="text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View Details
                </button>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit?.(family)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(family)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-3 text-sm">No families found</div>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => {
                setFilter("");
                setStatusFilter("all");
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination - Non-sticky, included in flow */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 p-4 mx-4 mb-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="text-xs text-gray-700">
              Page <span className="font-bold">{currentPage}</span> of{" "}
              <span className="font-bold">{totalPages}</span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Page indicators */}
          <div className="flex justify-center space-x-2">
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
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentPage === pageNum ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamiliesTable;