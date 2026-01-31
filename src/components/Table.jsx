import React, { useState, useMemo, useEffect, use } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  SlidersHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Plus,
} from "lucide-react";
import Config from "../Js/Config";
import axios from "axios";
// Reusable Table Component
const ResponsiveTable = ({
  data = [],
  columns = [],
  config = {
    title: "Data Table",
    searchable: true,
    filterable: true,
    sortable: true,
    pagination: true,
    itemsPerPage: 10,
    actions: [],
    mobileView: "cards", // 'cards' or 'table'
    exportable: false,
    refreshable: false,
  },
  onRowClick,
  onAction,
  loading = false,
  emptyMessage = "No data found",
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewMode, setViewMode] = useState(config.mobileView);


  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm && config.searchable) {
      filtered = filtered.filter((item) =>
        columns.some((col) => {
          const value = col.accessor
            ? typeof col.accessor === "function"
              ? col.accessor(item)
              : item[col.accessor]
            : "";
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        filtered = filtered.filter((item) => {
          const column = columns.find((col) => col.key === key);
          if (!column) return true;

          const cellValue = column.accessor
            ? typeof column.accessor === "function"
              ? column.accessor(item)
              : item[column.accessor]
            : item[key];

          if (column.filterOptions) {
            return (
              column.filterOptions
                .find((opt) => opt.value === value)
                ?.matches?.(cellValue, item) ??
              String(cellValue).toLowerCase() === String(value).toLowerCase()
            );
          }

          return String(cellValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig.key && config.sortable) {
      filtered.sort((a, b) => {
        const column = columns.find((col) => col.key === sortConfig.key);
        if (!column) return 0;

        const aValue = column.accessor
          ? typeof column.accessor === "function"
            ? column.accessor(a)
            : a[column.accessor]
          : a[sortConfig.key];

        const bValue = column.accessor
          ? typeof column.accessor === "function"
            ? column.accessor(b)
            : b[column.accessor]
          : b[sortConfig.key];

        if (column.sortFn) {
          return column.sortFn(aValue, bValue, sortConfig.direction);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [
    data,
    searchTerm,
    filters,
    sortConfig,
    columns,
    config.searchable,
    config.sortable,
  ]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / config.itemsPerPage);
  const paginatedData = config.pagination
    ? processedData.slice(
        (currentPage - 1) * config.itemsPerPage,
        currentPage * config.itemsPerPage
      )
    : processedData;

  // Handlers
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Render cell content
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    const value = column.accessor
      ? typeof column.accessor === "function"
        ? column.accessor(item)
        : item[column.accessor]
      : item[column.key];

    if (column.type === "status") {
      return <StatusBadge status={value} />;
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === "datetime") {
      return new Date(value).toLocaleString();
    }

    if (column.type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }

    return value || "-";
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
        iconClass: "text-green-500",
      },
      inactive: {
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200",
        iconClass: "text-red-500",
      },
      pending: {
        icon: AlertCircle,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        iconClass: "text-yellow-500",
      },
      default: {
        icon: CheckCircle,
        className: "bg-gray-100 text-gray-800 border-gray-200",
        iconClass: "text-gray-500",
      },
    };

    const config = statusConfig[status] || statusConfig.default;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        <Icon className={`w-3 h-3 mr-1 ${config.iconClass}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {paginatedData.length} of {processedData.length} items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {config.refreshable && (
              <button
                onClick={() => onAction?.("refresh")}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}

            {config.exportable && (
              <button
                onClick={() => onAction?.("export", selectedRows)}
                disabled={selectedRows.length === 0}
                className="flex items-center px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Export ({selectedRows.length})
              </button>
            )}

            {config.actions.includes("add") && (
              <button
                onClick={() => onAction?.("add")}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {config.searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Filter Controls */}
          {config.filterable && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center sm:justify-start px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {Object.values(filters).filter(Boolean).length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* Quick filters */}
                {columns
                  .filter((col) => col.quickFilter)
                  .map((column) => (
                    <select
                      key={column.key}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters[column.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(column.key, e.target.value)
                      }
                    >
                      <option value="">All {column.header}</option>
                      {column.filterOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ))}
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && config.filterable && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns
                  .filter((col) => col.filterable !== false)
                  .map((column) => (
                    <div key={column.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {column.header}
                      </label>
                      {column.filterType === "select" ? (
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters[column.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(column.key, e.target.value)
                          }
                        >
                          <option value="">All</option>
                          {column.filterOptions?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : column.filterType === "date" ? (
                        <input
                          type="date"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters[column.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(column.key, e.target.value)
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={`Filter by ${column.header}`}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters[column.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(column.key, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle (Mobile) */}
        <div className="flex items-center justify-between mt-4 sm:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                viewMode === "table"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                viewMode === "cards"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {/* Desktop/Table View */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {config.selectable && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        selectedRows.length === paginatedData.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => config.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {config.sortable && (
                        <span className="ml-1">
                          {sortConfig.key === column.key ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {config.actions.length > 0 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${selectedRows.includes(item.id) ? "bg-blue-50" : ""}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {config.selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {config.actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        {config.actions.includes("view") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction?.("view", item);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {config.actions.includes("edit") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction?.("edit", item);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {config.actions.includes("delete") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction?.("delete", item);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="sm:hidden">
          {viewMode === "cards" ? (
            <div className="space-y-3 p-4">
              {paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    {config.selectable && (
                      <div className="flex justify-end mb-2">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => toggleSelectRow(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Main card content */}
                    {columns.slice(0, 3).map((column) => (
                      <div key={column.key} className="mb-3 last:mb-0">
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                          {column.header}
                        </div>
                        <div className="text-sm text-gray-900">
                          {renderCell(item, column)}
                        </div>
                      </div>
                    ))}

                    {/* Action buttons */}
                    {config.actions.length > 0 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          {config.actions.includes("view") && (
                            <button
                              onClick={() => onAction?.("view", item)}
                              className="text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              View
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {config.actions.includes("edit") && (
                            <button
                              onClick={() => onAction?.("edit", item)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Mobile table view
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      {columns.slice(0, 3).map((column) => (
                        <td key={column.key} className="px-4 py-3">
                          <div className="text-xs font-medium text-gray-500">
                            {column.header}
                          </div>
                          <div className="text-sm text-gray-900">
                            {renderCell(item, column)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Empty State */}
        {processedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              {Object.values(filters).filter(Boolean).length > 0 || searchTerm
                ? "No items match your filters"
                : emptyMessage}
            </div>
            {(Object.values(filters).filter(Boolean).length > 0 ||
              searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {config.pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * config.itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  currentPage * config.itemsPerPage,
                  processedData.length
                )}
              </span>{" "}
              of <span className="font-medium">{processedData.length}</span>{" "}
              results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center space-x-1">
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
                      className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;
